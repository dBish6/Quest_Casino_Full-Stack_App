import type { UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { useRef, useState } from "react";

import { capitalize } from "@qc/utils";

import { Icon } from "@components/common";
import { Button } from "@components/common/controls";
import { ModalTrigger } from "@components/modals";

import s from "./userGameHistory.module.css";

export interface UserGameHistoryProps extends React.ComponentProps<"div"> {
  gameHistory: UserProfileCredentials["activity"]["game_history"];
  username?: string;
}

export default function UserGameHistory({ gameHistory, username, ...props }: UserGameHistoryProps) {
  const [order, setOrder] = useState<{
    timestamp?: boolean;
    result?: boolean;
    history: typeof gameHistory;
  }>({ timestamp: true, history: gameHistory });

  const handleSort = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget,
      isTimestamp = target.getAttribute("aria-label")!.includes("Timestamp"),
      isDescending = target.getAttribute("aria-pressed") === "true";

    let sortHistory;
    if (target.getAttribute("aria-label")!.includes("Timestamp")) {
      sortHistory = isDescending ? gameHistory.slice().reverse() : gameHistory;
    } else {
      const order = isDescending ? ["loss", "draw", "win"] : ["win", "draw", "loss"];
      sortHistory = gameHistory.slice();
      sortHistory.sort((a, b) =>
        order.indexOf(a.result.outcome) - order.indexOf(b.result.outcome)
      );
    }

    target.setAttribute(
      "aria-label",
      `Sort ${isTimestamp ? "Timestamp" : "Result"} in ${isDescending ? "Descending" : "Ascending"} Order`
    );

    setOrder({ [isTimestamp ? "timestamp" : "result"]: !isDescending, history: sortHistory });
  };

  return (
    <div role="presentation" className={s.history} {...props}>
      <header>
        <hgroup className={s.title} data-scale-text={!!username}>
          <Icon aria-hidden="true" id={username ? "notepad-24" : "notepad-32"} scaleWithText />
          <h2 id="hUsrHistory">Activity</h2>
        </hgroup>
        {username && (
          // TODO: Could just show this at all times.
          <ModalTrigger
            query={{ param: "ghist", value: username }}
            className={s.viewFull}
          >
            View Full List
          </ModalTrigger>
        )}
      </header>
      <div
        role="table"
        aria-labelledby="hUsrHistory"
        aria-describedby="cUsrHistory"
        aria-live="polite"
        className={s.history}
      >
        <div role="caption" id="cUsrHistory" style={{ position: "absolute", opacity: 0 }}>
          Your game history.
        </div>
        <div role="rowgroup">
          <div role="row">
            <div role="columnheader">Game</div>
            <div role="columnheader" aria-label="Result">
              <span>Result</span>
              <Button
                aria-label="Sort Result by Descending"
                aria-controls="histRowGroup"
                aria-pressed={order.result}
                intent="ghost"
                size="xsm"
                type="submit"
                iconBtn
                onClick={handleSort}
              >
                <Icon aria-hidden="true" id="expand-10" />
              </Button>
            </div>
            <div role="columnheader" aria-label="TimeStamp">
              <span>Timestamp</span>
              <Button
                aria-label="Sort Timestamp by Ascending"
                aria-controls="histRowGroup"
                aria-pressed={order.timestamp}
                intent="ghost"
                size="xsm"
                type="submit"
                iconBtn
                onClick={handleSort}
              >
                <Icon aria-hidden="true" id="expand-10" />
              </Button>
            </div>
          </div>
        </div>
        <div role="rowgroup" id="histRowGroup">
          {order.history.map((game) => (
            <div key={game.timestamp} role="row">
              <div role="cell" title={game.game_name}>{game.game_name}</div>
              <div role="cell" data-outcome={game.result.outcome}>
                <span>{capitalize(game.result.outcome)}</span>
                {["win", "draw"].includes(game.result.outcome) ? "+" : "-"}{game.result.earnings}
              </div>
              <div role="cell">{game.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResentGame({ gameHistory }: UserGameHistoryProps) {
  const resentGame  = useRef(gameHistory[0]);

  return (
    <div className={s.resentGame}>
      <h4>Resent Game</h4>
      <p>{resentGame.current.game_name} <span>{resentGame.current.result.outcome}</span></p>
    </div>
  );
}
