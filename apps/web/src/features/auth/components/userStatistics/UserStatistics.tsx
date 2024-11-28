import type { VariantProps } from "class-variance-authority";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useLayoutEffect, useEffect, useRef, useState, Fragment } from "react";
import { cva } from "class-variance-authority";

import { capitalize } from "@qc/utils";

import { Select } from "@components/common/controls";
import { ScrollArea } from "@components/scrollArea";
import { ModalTrigger } from "@components/modals";

import s from "./userStatistics.module.css";

const statistics = cva(s.stats, {
  variants: {
    intent: {
      table: s.table,
      blocks: s.blocks
    }
  }
});

interface UserRecord {
  wins: [string, number][];
  losses: [string, number][];
  gamesPlayed: UserCredentials["statistics"]["losses"]; // Uses the same object like losses and wins.
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
  scaleText?: boolean;
}

function initializeRecord(stats: UserStatisticsProps["stats"]): UserRecord {
  const wins = Object.entries(stats.wins).filter(([key]) => key !== "streak"),
    losses = Object.entries(stats.losses);

  const gamesPlayed: any = {};
  for (const [title, num] of wins) gamesPlayed[title] = num;
  for (const [title, num] of losses) gamesPlayed[title] += num;

  const conqueredQuests: string[] = [];
  for (const [title, obj] of Object.entries(stats.progress.quest)) {
    if (obj.current >= obj.quest.cap) conqueredQuests.push(title);
  }
  // const conqueredQuests = ["Beginner's Luck", "Outlaw", "Crank That", "Ass Hatter"];

  return { wins, losses, gamesPlayed, conqueredQuests };
};

function calcWinRate(wins: number, losses: number) {
  return Math.round((wins / (wins + losses)) * 1000) / 10;
};

export default function UserStatistics({ stats, username, className, intent, scaleText = false, ...props }: UserStatisticsProps) {
  const record = useRef<UserRecord>(initializeRecord(stats)),
    [category, setCategory] = useState({ index: 0, winRate: calcWinRate(stats.wins.total, stats.losses.total) });

  return (
    <div className={statistics({ className, intent })} data-scale-text={scaleText} {...props}>
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
                  const index = e.currentTarget.selectedIndex - 1;
                  setCategory({
                    index,
                    winRate: calcWinRate(
                      record.current.wins[index][1],
                      record.current.losses[index][1]
                    ),
                  });
                }}
              >
                {record.current.wins.map(([title]) => (
                  <option value={title}>{capitalize(title)}</option>
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
                <div role="row">
                  <span role="rowheader">Wins</span>
                  <span role="cell">{record.current.wins[category.index][1]}</span>
                </div>
                <div role="row">
                  <span role="rowheader">Losses</span>
                  <span role="cell">{record.current.losses[category.index][1]}</span>
                </div>
                <div role="row">
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
                Your win and loss record for the selected category.
              </div>
              <div role="rowgroup">
                <div role="row">
                  <span role="rowheader">Table</span>
                  <span role="cell">{record.current.gamesPlayed.table}</span>
                </div>
                <div role="row">
                  <span role="rowheader">Slots</span>
                  <span role="cell">{record.current.gamesPlayed.slots}</span>
                </div>
                <div role="row">
                  <span role="rowheader">Dice</span>
                  <span role="cell">{record.current.gamesPlayed.dice}</span>
                </div>
                <div role="row">
                  <span role="rowheader">Total</span>
                  <span role="cell">{record.current.gamesPlayed.total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={s.quests}>
        {intent === "table" && (
          <>
            <h3 aria-label="Quests Summery" className="hUnderline">
              Quests
            </h3>
            <ScrollArea orientation="horizontal">
              <ul aria-label="Completed Quests" aria-describedby="questCount">
                {record.current.conqueredQuests.map((quest) => (
                  <li title={quest}>{quest}</li>
                ))}
              </ul>
            </ScrollArea>
          </>
        )}

        <div>
          <p id="questCount">
            <span>{record.current.conqueredQuests.length}</span> Quest
            {record.current.conqueredQuests.length === 1 ? "" : "s"} Completed
          </p>
          <ModalTrigger
            aria-label={`View All ${username}'s Completed Quests`}
            // TODO:
            intent="primary"
            queryKey={{ param: "qhist", value: username }}
            className={s.viewBtn}
          >
            View Quests
          </ModalTrigger>
        </div>
      </div>
    </div>
  );
}
