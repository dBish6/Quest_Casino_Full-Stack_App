import type { ViewUserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import useLeaderboard from "@hooks/useLeaderboard";
import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { useLazyGetUserProfileQuery } from "@authFeat/services/authApi";

import { ModalQueryKey, ModalTemplate } from "@components/modals";
import { Link } from "@components/common";
import { Spinner } from "@components/loaders";
import { UserStatistics } from "@authFeat/components/userStatistics";
import { UserGameHistory } from "@authFeat/components/userActivity";

import s from "./viewProfileModal.module.css";
import { ScrollArea } from "@components/scrollArea";
import { UserGeneral } from "@authFeat/components/userGeneral";

export default function ViewProfileModal() {
  const [searchParams] = useSearchParams(),
    username = searchParams.get(ModalQueryKey.VIEW_PROFILE_MODAL) || "";

  const { selectedUser } = useLeaderboard(),
    storedUser = useAppSelector(selectUserCredentials)! || {};

  const [getUserProfile, { isFetching: profileLoading, error: profileError }] = useLazyGetUserProfileQuery(),
    [user, setUser] = useState<ViewUserProfileCredentials | null>(null);

  useResourcesLoadedEffect(() => {
    // A user selected from the leaderboard can have the same credentials needed.
    if (selectedUser) {
      setUser(selectedUser);
    } else if (username) {
      let query;

      if (storedUser.username === username) {
        // Attempts to use the cached result from fetching the user's private profile.
        query = getUserProfile(undefined, true);
        query.then((res: any) => {
          if (res.isSuccess && res.data?.user)
            setUser({ ...storedUser, ...res.data.user as ViewUserProfileCredentials });
        });
      } else {
        query = getUserProfile({ username: decodeURIComponent(username) });
        query.then((res: any) => {
          if (res.isSuccess && res.data?.user)
            setUser(res.data?.user as ViewUserProfileCredentials);
        });
      }
      return () => query?.abort();
    }
  }, [username]);

  return (
    <ModalTemplate
      aria-description="A user's profile, including their profile picture, bio, statistics, and game history. You can also send a message, add them as a friend, or block them."
      queryKey="prof"
      width="778px"
      className={s.modal}
      onCloseAutoFocus={() => setUser(null)}
    >
      {() =>
        profileLoading ? (
          <Spinner intent="primary" size="xxl" />
        ) : !user ? (
          <p role="alert">
            {isFetchBaseQueryError(profileError) ? (
              profileError.data?.ERROR.endsWith("in our system.") ? (
                profileError.data.ERROR
              ) : (
                <>
                  An unexpected server error occurred. Please try refreshing the
                  page. If the error persists, feel free to reach out to{" "}
                  <Link intent="primary" to="/support">
                    Support
                  </Link>
                  .
                </>
              )
            ) : (
              <>
                An unknown error occurred. The server might down or there was a
                issue processing your request. Please try refreshing the page. If
                the error persists, feel free to reach out to{" "}
                <Link intent="primary" to="/support">
                  Support
                </Link>
                .
              </>
            )}
          </p>
        ) : (
          <div role="group">
            <section aria-label="General Information" className={s.info}>
              <UserGeneral size="full" user={user} />
            </section>

            <section aria-labelledby="hStatistics" className={s.statistics}>
              <UserStatistics
                intent="table"
                stats={user.statistics}
                username={user.username}
              />
            </section>

            <section aria-labelledby="hUsrHistory" className={s.activity}>
              <ScrollArea orientation="vertical">
                <UserGameHistory
                  gameHistory={user.activity.game_history}
                  username={user.username}
                />
              </ScrollArea>
            </section>
          </div>
        )
      }
    </ModalTemplate>
  );
}

ViewProfileModal.restricted = "loggedOut";
