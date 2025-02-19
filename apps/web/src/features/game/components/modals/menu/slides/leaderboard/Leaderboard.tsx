import type { LeaderboardContextValues } from "./LeaderboardProvider";
import type { ViewUserProfileCredentials } from "@qc/typescript/typings/UserCredentials";
import type { LeaderboardType } from "@qc/constants";

import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import { capitalize } from "@qc/utils";

import useLeaderboard from "@hooks/useLeaderboard";
import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useLazyGetLeaderboardQuery } from "@gameFeat/services/gameApi";

import { ModalQueryKey } from "@components/modals";
import { ScrollArea } from "@components/scrollArea";
import { Select } from "@components/common/controls";
import { Avatar } from "@components/common";
import { Spinner } from "@components/loaders";
import { UserGeneral } from "@authFeat/components/userGeneral";
import { UserStatistics } from "@authFeat/components/userStatistics";

import s from "./leaderboard.module.css";

interface TopUserCard extends LeaderboardContextValues {
  type: LeaderboardType;
  user: ViewUserProfileCredentials;
  rank: number;
}

export default function Leaderboard() {
  const [searchParams] = useSearchParams(),
    slide = searchParams.get(ModalQueryKey.MENU_MODAL) === "Leaderboard";

  const { selectedUser, setSelectedUser } = useLeaderboard();

  const [getLeaderboard, { isFetching: leaderboardLoading }] = useLazyGetLeaderboardQuery(),
    [topUsers, setTopUsers] = useState<{
      type: LeaderboardType;
      users: ViewUserProfileCredentials[] | null;
    }>({ type: "rate", users: null });

  useResourcesLoadedEffect(() => {
    if (slide) {
      const query = getLeaderboard({ type: topUsers.type }, true);
      query.then((res) => {
        if (res.isSuccess && res.data?.users)
          setTopUsers((prev) => ({ ...prev, users: res.data.users }));
      });

      return () => query.abort();
    }
  }, [slide, topUsers.type]);

  return (
    <div
      role="group"
      aria-label="Leaderboard"
      aria-roledescription="slide"
      id="lSlide"
      className={`slideContent ${s.leaderboard}`}
    >
      <section aria-label="Top Users" className={s.board}>
        <div className={s.filter}>
          <Select
            aria-controls="topUsers"
            label="Change Leaderboard"
            hideLabel
            intent="primary"
            size="lrg"
            id="leaderboardSelect"
            defaultValue="rate"
            disabled={!topUsers}
            onInput={(e) => {
              const target = e.currentTarget;
              setTopUsers((prev) => ({
                ...prev,
                type: target.options[target.selectedIndex].value as LeaderboardType
              }));
            }}
          >
            <option value="rate">Win Rate</option>
            <option value="total">Total Wins</option>
          </Select>
        </div>
        <ScrollArea orientation="vertical" type="scroll" className={s.topUsers}>
          {leaderboardLoading ? (
            <Spinner intent="primary" size="xl" />
          ) : topUsers.users?.length ? (
            <ul aria-label="Leaders" id="topUsers">
              {topUsers.users.map((user, i) => (
                <TopUser
                  key={user.member_id}
                  type={topUsers.type}
                  user={user}
                  rank={i + 1}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              ))}
            </ul>
          ) : (
            <p>Unexpectedly no users.</p>
          )}
        </ScrollArea>
      </section>

      <section aria-label="Selected User" className={s.selected}>
        {!selectedUser ? (
          <p>Select a user from the board.</p>
        ) : (
          <ScrollArea orientation="vertical">
            <UserGeneral size="compact" user={selectedUser} />

            <UserStatistics
              intent="block"
              stats={selectedUser.statistics}
              username={selectedUser.username}
              gameHistory={selectedUser.activity.game_history}
            />
          </ScrollArea>
        )}
      </section>
    </div>
  );
}

function TopUser({ type, user, rank, selectedUser, setSelectedUser }: TopUserCard) {
  return (
    <li className={s.topUser}>
      <button
        aria-label={`${rank}. ${user.username} ${user.statistics.wins[type]}${type === "rate" ? "% Win Rate" : " Total Wins" }`}
        aria-pressed={selectedUser?.member_id === user.member_id}
        onClick={() => setSelectedUser(user)}
      >
        <span data-rank={rank}>{rank}.</span>
        <div className={s.content}>
          <Avatar size="md" user={user} linkProfile={false} />
          <hgroup role="group" aria-roledescription="heading group">
            <h2 title={user.username}>{user.username}</h2>
            <p
              title={`${user.legal_name.first} ${user.legal_name.last}`}
              aria-roledescription="subtitle"
            >
              {user.legal_name.first} {user.legal_name.last}
            </p>
          </hgroup>
        </div>

        <div className={s.wins}>
          <p {...(type === "rate" && { "aria-label": "Win Rate" })}>
            {capitalize(type)}
          </p>
          <p>
            {user.statistics.wins[type]}
            {type === "rate" && "%"}
          </p>
        </div>
      </button>
    </li>
  );
}
