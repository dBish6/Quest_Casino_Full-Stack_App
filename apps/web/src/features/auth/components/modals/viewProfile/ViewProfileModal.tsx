import type { ViewUserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import useBreakpoint from "@hooks/useBreakpoint";
import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { UPDATE_CHAT_ROOM } from "@chatFeat/redux/chatSlice";

import { useLazyGetUserProfileQuery, useManageFriendRequestMutation, useUnfriendMutation, useUpdateProfileMutation } from "@authFeat/services/authApi";

import { ModalQueryKey, ModalTemplate } from "@components/modals";
import { Button } from "@components/common/controls";
import { Avatar, Image, Link } from "@components/common";
import { Spinner } from "@components/loaders";
import { UserStatistics } from "@authFeat/components/userStatistics";
import { UserGameHistory } from "@authFeat/components/userActivity";

import s from "./viewProfileModal.module.css";
import { ScrollArea } from "@components/scrollArea";

export default function ViewProfileModal() {
  const [searchParams, setSearchParams] = useSearchParams(),
    username = searchParams.get(ModalQueryKey.VIEW_PROFILE_MODAL) || "";

  const { viewport } = useBreakpoint();

  const storedUser = useAppSelector(selectUserCredentials)! || {},
    dispatch = useAppDispatch();

  const [getUserProfile, { isFetching: profileLoading, error: profileError }] = useLazyGetUserProfileQuery(),
    [user, setUser] = useState<ViewUserProfileCredentials | null>(null);

  const isFriend = !!storedUser.friends.list[user?.member_id || ""],
    isBlocked = !!storedUser.settings.blocked_list[user?.member_id || ""];

  const [emitManageFriends, { isLoading: manageFriendsLoading }] = useManageFriendRequestMutation(),
    [emitUnfriend, { isLoading: unfriendLoading }] = useUnfriendMutation();

  const [patchUpdateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();

  useResourcesLoadedEffect(() => {
    if (username) {
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
              <div className={s.content}>
                <Avatar
                  size="xxxl"
                  user={user}
                  linkProfile={false}
                />
                <div>
                  <hgroup role="group" aria-roledescription="heading group">
                    <Title asChild>
                      <h2 title={user.username}>{user.username}</h2>
                    </Title>
                    <div role="presentation" className={s.legalName}>
                      <p
                        title={`${user.legal_name.first} ${user.legal_name.last}`}
                        aria-roledescription="subtitle"
                      >
                        {user.legal_name.first} {user.legal_name.last}
                      </p>
                      {/* TODO: Languages Flags */}
                      <Image
                        src="/images/no-image.webp"
                        alt="Country Flag"
                        className={s.flag}
                        load={false}
                      />
                    </div>
                  </hgroup>
                  {user.bio && (
                    <ScrollArea orientation="vertical" className={s.bio}>
                      <p aria-label="bio">{user.bio}</p>
                    </ScrollArea>
                  )}
                </div>
              </div>
              <div className={s.actions}>
                {isFriend && (
                  <Button
                    intent="primary"
                    size={viewport === "small" ? "md" : "lrg"}
                    disabled={storedUser.username === user.username}
                    onClick={() => {
                      dispatch(
                        UPDATE_CHAT_ROOM({
                          proposedId: user.member_id,
                          accessType: "private"
                        })
                      );

                      setSearchParams((params) => {
                        params.set("aside", "enlarged");
                        params.delete(ModalQueryKey.VIEW_PROFILE_MODAL);
                        return params;
                      });
                    }}
                  >
                    Send Message
                  </Button>
                )}
                <Button
                  aria-live="polite"
                  intent="primary"
                  size={viewport === "small" ? "md" : "lrg"}
                  disabled={unfriendLoading || manageFriendsLoading || storedUser.username === user.username}
                  onClick={() => {
                    if (isFriend) emitUnfriend({ username, member_id: user.member_id });
                    else emitManageFriends({ toasts: true, action_type: "request", friend: user });
                  }}
                >
                  {unfriendLoading || manageFriendsLoading ? (
                    <Spinner
                      intent="primary"
                      size={viewport === "small" ? "sm" : "md"}
                    />
                  ) : (
                    isFriend ? "Unfriend" : "Add as Friend"
                  )}
                </Button>
                <Button
                  aria-live="polite"
                  intent="secondary"
                  size={viewport === "small" ? "md" : "lrg"}
                  disabled={updateLoading || storedUser.username === user.username}
                  onClick={() => {
                    patchUpdateProfile({
                      allow500: false,
                      settings: {
                        blocked_list: [
                          { op: isBlocked ? "delete" : "add", member_id: user.member_id }
                        ]
                      }
                    });
                  }}
                >
                  {updateLoading ? (
                    <Spinner
                      intent="primary"
                      size={viewport === "small" ? "sm" : "md"}
                    />
                  ) : (
                    isBlocked ? "Unblock" : "Block"
                  )}
                </Button>
              </div>
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
