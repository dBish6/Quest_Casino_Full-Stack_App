import type { VariantProps } from "class-variance-authority";
import type { Quest } from "@qc/typescript/dtos/GetQuestsDto";

import { cva } from "class-variance-authority";

import formatCurrency from "@authFeat/utils/formatCurrency";

import s from "./questCard.module.css";
import { Icon } from "@components/common";
import { useRef } from "react";

const questCard = cva(s.card, {
  variants: {
    size: {
      md: s.md,
      lrg: s.lrg
    }
  }
});

export interface QuestCardProps extends React.ComponentProps<"div">,
    VariantProps<typeof questCard> {
  quest: Quest;
  /** The user's current progress for quest completion. */
  current?: number;
}

export default function QuestCard({ className, size, quest, current = 0 }: QuestCardProps) {
  const label = useRef({
    title: "title-" + quest.title.toLowerCase().replaceAll(" ", "-"),
    description: "title-" + quest.title.toLowerCase().replaceAll(" ", "-"),
    progress: "title-" + quest.title.toLowerCase().replaceAll(" ", "-")
  });

  const completed = current >= quest.cap;

  return (
    <li
      aria-labelledby={label.current.title}
      aria-describedby={`${label.current.description} ${label.current.progress}`}
    >
      <article
        className={questCard({ className, size })}
        data-completed={completed}
      >
        <div className={s.content}>
          <div>
            <h3 id={label.current.title} className="hUnderline">{quest.title}</h3>
            <p id={label.current.description}>{quest.description}</p>
          </div>
          <p>
            <span>Reward:</span>
            <span>
              {quest.reward.type === "spins"
                ? `${quest.reward.value} Free Spins`
                : formatCurrency(quest.reward.value)}
            </span>
          </p>
        </div>

        <div className={s.progress}>
          <div
            role="meter"
            aria-label="Quest Progress"
            aria-describedby={label.current.progress}
            aria-valuemin={0}
            aria-valuemax={quest.cap}
            aria-valuenow={current}
            className={s.meter}
          >
            <div className={s.fill} style={{ width: `${(current / quest.cap) * 100}%` }} />
          </div>
          <div className={s.completion}>
            <span id={label.current.progress}>{current}/{quest.cap}</span>
            {completed && (
              <Icon
                aria-label="Completed"
                id={`check-mark-${size === "lrg" ? "16" : "14"}`}
                fill="var(--c-status-green)"
              />
            )}
          </div>
        </div>
      </article>
    </li>
  );
}