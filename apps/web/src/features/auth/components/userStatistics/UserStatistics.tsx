import type { VariantProps } from "class-variance-authority";
import type { UserCredentials, UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { useEffect, useRef, useMemo, useState } from "react";
import { cva } from "class-variance-authority";

import { calcWinRate, capitalize } from "@qc/utils";

import { Icon } from "@components/common";
import { Select } from "@components/common/controls";
import { ScrollArea } from "@components/scrollArea";
import { ModalTrigger } from "@components/modals";
import { ResentGame } from "@authFeat/components/userActivity";

import s from "./userStatistics.module.css";

const statistics = cva(s.stats, {
  variants: {
    intent: {
      table: s.table,
      block: s.block
    }
  }
});

interface UserRecord {
  wins: [string, number][];
  losses: [string, number][];
  gamesPlayed: UserCredentials["statistics"]["losses"]; // Uses the same object like wins and losses.
  conqueredQuests: string[];
}

export interface QuestsCompletedProps extends VariantProps<typeof statistics> {
  quests: UserRecord["conqueredQuests"];
  username: string;
}

export interface UserStatisticsProps extends React.ComponentProps<"div">,
  VariantProps<typeof statistics> {
  stats: UserCredentials["statistics"];
  username: string;
  gameHistory?: UserProfileCredentials["activity"]["game_history"];
  scaleText?: boolean;
}

function initializeRecord(stats: UserStatisticsProps["stats"]): UserRecord {
  const wins = Object.entries(stats.wins).filter(([key]) => key !== "streak" && key !== "rate"),
    losses = Object.entries(stats.losses);

  const gamesPlayed: any = {};
  for (const [title, num] of wins) gamesPlayed[title] = num;
  for (const [title, num] of losses) gamesPlayed[title] += num;

  const conqueredQuests: string[] = [];
  for (const [title, obj] of Object.entries(stats.progress.quest)) {
    if (obj.current >= obj.quest.cap) conqueredQuests.push(title);
  }

  return { wins, losses, gamesPlayed, conqueredQuests };
};

export default function UserStatistics({
  stats,
  username,
  gameHistory,
  className,
  intent,
  scaleText = false,
  ...props
}: UserStatisticsProps) {
  const questsContainerRef = useRef<HTMLDivElement>(null);

  const record = useMemo(() => initializeRecord(stats), [stats]),
    [category, setCategory] = useState({ index: 0, winRate: stats.wins.rate });

  useEffect(() => {
    let retries = 2
    const interval = setInterval(() => {
      const scrollbar = questsContainerRef.current!.querySelector<HTMLDivElement>(".scrollbar");
      if (scrollbar) {
        questsContainerRef.current!.style.setProperty("--_horz-scrollbar-height", "19px");
        clearInterval(interval);
      } else if (retries === 0) {
        clearInterval(interval);
      }
      retries--;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={statistics({ className, intent })} data-scale-text={scaleText} {...props}>
      <hgroup>
        <Icon
          aria-hidden="true"
          id={scaleText ? "bar-chart-38" : "bar-chart-28"}
          scaleWithText
        />
        <h2 id="hStatistics" {...(!scaleText && { className: "hUnderline" })}>
          Statistics
        </h2>
      </hgroup>
      
      {intent === "table" && (
        <>
          <div className={s.winLoss}>
            <header>
              <h3 id="hWinLoss" className="hUnderline">Win/Loss</h3>
              <Select
                aria-controls="winLossTable"
                label="Change Category"
                intent="ghost"
                id="WinLossSelect"
                defaultValue="total"
                onInput={(e) => {
                  const target = e.currentTarget,
                    index = target.selectedIndex - 1;

                  setCategory({
                    index,
                    winRate:
                      target.value === "total"
                        ? stats.wins.rate
                        : calcWinRate(
                            record.wins[index][1],
                            record.losses[index][1]
                          )
                  });
                }}
              >
                {record.wins.map(([title]) => (
                  <option key={title} value={title}>{capitalize(title)}</option>
                ))}
              </Select>
            </header>
            <div
              role="table"
              aria-labelledby="hWinLoss"
              aria-describedby="cWinLoss"
              aria-live="polite"
              id="winLossTable"
            >
              <div role="caption" id="cWinLoss" style={{ position: "absolute", opacity: 0 }}>
                Your win and loss record for the selected category.
              </div>
              <div role="rowgroup">
                <div role="row" title={record.wins[category.index][1] + " Wins"}>
                  <span role="rowheader">Wins</span>
                  <span role="cell">{record.wins[category.index][1]}</span>
                </div>
                <div role="row" title={record.wins[category.index][1] + " Losses"}>
                  <span role="rowheader">Losses</span>
                  <span role="cell">{record.losses[category.index][1]}</span>
                </div>
                <div role="row" title={category.winRate + "%" + " Win Rate"}>
                  <span role="rowheader">Win Rate</span>
                  <span role="cell">{category.winRate + "%"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.gamesPlayed}>
            <h3 id="hGamesPlayed" className="hUnderline">Games Played</h3>
            <div
              role="table"
              aria-labelledby="hGamesPlayed"
              aria-describedby="cGamesPlayed"
            >
              <div role="caption" id="cGamesPlayed" style={{ position: "absolute", opacity: 0 }}>
                {username + "'s" || "Your"} total games played for all categories.
              </div>
              <div role="rowgroup">
                <div role="row" title={record.gamesPlayed.table + " Table Games Played"}>
                  <span role="rowheader">Table</span>
                  <span role="cell">{record.gamesPlayed.table}</span>
                </div>
                <div role="row" title={record.gamesPlayed.slots + " Slots Games Played"}>
                  <span role="rowheader">Slots</span>
                  <span role="cell">{record.gamesPlayed.slots}</span>
                </div>
                <div role="row" title={record.gamesPlayed.dice + " Dice Games Played"}>
                  <span role="rowheader">Dice</span>
                  <span role="cell">{record.gamesPlayed.dice}</span>
                </div>
                <div role="row" title={record.gamesPlayed.total + " Total Games Played"}>
                  <span role="rowheader">Total</span>
                  <span role="cell">{record.gamesPlayed.total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div ref={questsContainerRef} className={s.quests}>
        {intent === "table" && (
          <>
            <h3 aria-label="Quests Summery" className="hUnderline">
              Quests
            </h3>
            <ScrollArea orientation="horizontal">
              {record.conqueredQuests.length > 0 && (
                <ul aria-label="Completed Quests" aria-describedby="questCount">
                  {record.conqueredQuests.map((quest) => (
                    <li key={quest} title={quest}>
                      {quest}
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </>
        )}

        {intent === "block" &&
          <>
            <div className={s.wins}>
              <h4>Total Wins</h4>
              <p>{record.wins[0][1]}</p>
            </div>

            <div className={s.losses}>
              <h4>Total Losses</h4>
              <p>{record.losses[0][1]}</p>
            </div>

            <div className={s.played}>
              <h4>Total Games</h4>
              <p>{record.gamesPlayed.total}</p>
            </div>

            <div className={s.rate}>
              <h4>Win Rate</h4>
              <p>{record.wins[4][1] + "%"}</p>
            </div>
          </>
        }
        <div className={s.conquered}>
          <p id="questCount">
            <span>{record.conqueredQuests.length}</span> Quest
            {record.conqueredQuests.length === 1 ? "" : "s"} Completed
          </p>
          <ModalTrigger
            aria-label={`View All ${username}'s Completed Quests`}
            intent="primary"
            query={{ param: "qhist", value: encodeURIComponent(username) }}
            className={s.viewBtn}
          >
            View Quests
          </ModalTrigger>
        </div>
        {intent === "block" && gameHistory && (
          <ResentGame gameHistory={gameHistory} />
        )}
      </div>
    </div>
  );
}
