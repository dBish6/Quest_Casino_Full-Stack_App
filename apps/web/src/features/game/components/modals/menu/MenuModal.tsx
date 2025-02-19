import type DeepReadonly from "@qc/typescript/typings/DeepReadonly";
import type { SetURLSearchParams } from "react-router-dom";
import type Direction from "@typings/Direction";
import type { IconIds } from "@components/common";

import { useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Title } from "@radix-ui/react-dialog";

import useLeaderboard from "@hooks/useLeaderboard";

import { ModalQueryKey, ModalTemplate } from "@components/modals";
import { Icon } from "@components/common";
import { Button } from "@components/common/controls";
import { HoverCard } from "@components/hoverCard";
import { ScrollArea } from "@components/scrollArea";
import { Leaderboard, Quests, Bonuses } from "./slides";

import s from "./menuModal.module.css";

export type MenuSlide = "Leaderboard" | "Quests" | "Bonuses";

const SLIDE_MAP: DeepReadonly<
  Record<string, { icon: string; Comp: (setRenewsIn?: any) => React.JSX.Element; steps?: React.JSX.Element[] }>
> = {
  Leaderboard: { icon: "list", Comp: Leaderboard },
  Quests: {
    icon: "scroll",
    Comp: Quests,
    steps: [
      <>Check the <b>quest description</b> on the quest card to see what objective you need to complete.</>,
      <>Track your progress; the <b>meter</b> will fill as you get closer to completion. For example, if the quest is to win 8 games of blackjack, and you've won 2 games, the progress will <b>show 2/8</b>. Some quest's have single steps (e.g., 1/1).</>,
      <>Complete the objective by <b>playing our games</b>.</>,
      <>Once you've completed the quest, <b>press "Claim"</b> to receive the reward outlined on the quest card. Rewards could include <b>money</b> or <b>game-specific</b> rewards like Free Spins.</>
    ]
  },
  Bonuses: {
    icon: "gift",
    Comp: Bonuses,
    steps: [
      <>Check the <b>bonus title</b> on the bonus card to understand the objective for claiming a bonus.</>,
      <>Some bonuses track progress using a <b>meter</b>, such as "5 Daily Logins." For example, after 2 logins, your progress will <b>show 2/5</b>.</>,
      <>Bonuses reward you with boosts in games. For example, with a <b>10x bonus</b>, if you <b>win $100</b>, you'll get an extra $10 (10% of your total winnings).</>,
      <>
        Each bonus has a <b>sliding cap</b> that depends on your total winnings
        and the game's <b>absolute max cap</b>. The sliding cap is always 10% of
        your winnings, but the <b>absolute max cap</b> is a fixed limit that
        bonuses cannot exceed. For example:
        <ul aria-label="Bonus Examples">
          <li>
            If your bet is $100 and your winnings are $1,000{" "}
            <b>with a 10x multiplier</b>, the sliding cap would be 10% of $1,000
            = $100. If the absolute max cap is $80, your bonus will be capped at
            $80.
          </li>
          <li>
            If your bet is $50 and your winnings are $200{" "}
            <b>with a 4x multiplier</b>, the sliding cap would be 10% of $200 =
            $20. Since $20 is below the absolute max cap, your bonus will be
            $20.
          </li>
        </ul>
      </>,
      <>Once a bonus is completed, <b>press "Claim"</b> to activate the bonus multiplier to use it in our games. <b>All bonuses last 24 hours</b> and <b>only one bonus can be activated at a time</b>.</>
    ]
  }
};

function handleTransition(setSearchParams: SetURLSearchParams, direction?: Direction) {
  setSearchParams((params) => {
    let slide = params.get(ModalQueryKey.MENU_MODAL)!;
    if (slide === (direction === "left" ? "Leaderboard" : "Quests")) {
      slide = "Bonuses";
    } else if (slide === (direction === "left" ? "Bonuses" : "Leaderboard")) {
      slide = "Quests";
    } else {
      slide = "Leaderboard";
    }
    params.set(ModalQueryKey.MENU_MODAL, slide);
    return params;
  });
}

export default function MenuModal() {
  const [searchParams, setSearchParams] = useSearchParams(),
    currentSlide = searchParams.get(ModalQueryKey.MENU_MODAL)! as MenuSlide;

  const renewRef = useRef<HTMLTimeElement>(null),
    [renewsIn, setRenewsIn] = useState("00:00:00");

  const { setSelectedUser } = useLeaderboard();

  const SlideComponent = SLIDE_MAP[currentSlide]?.Comp || null;

  useEffect(() => {
    if (renewsIn !== "00:00:00") {
      const targetTime = new Date(renewsIn).getTime();

      const updateCountdown = () => {
        const timeLeft = Math.max(0, targetTime - Date.now());

        const hours = Math.floor(timeLeft / (1000 * 60 * 60)),
          minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
          seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        renewRef.current!.innerHTML = formattedTime;
        renewRef.current!.dateTime = formattedTime;

        if (timeLeft <= 0) clearInterval(timerInterval);
      };

      updateCountdown();
      const timerInterval = setInterval(updateCountdown, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [renewsIn]);

  useEffect(() => {
    setRenewsIn("00:00:00");
  }, [currentSlide]);
  
  return (
    <ModalTemplate
      aria-description="Menu slides. Use the arrow buttons to navigate between slides, or select specific slides using the indicators at the bottom to view the our games leaderboard, manage bonuses, or manage quests."
      queryKey="menu"
      width="768px"
      className={s.modal}
      onCloseAutoFocus={() => setSelectedUser(null)} // Resets selected leaderboard user on close.
    >
      {() => (
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Menu"
          aria-live="polite"
        >
          <div className="head" data-slide={currentSlide}>
            <hgroup>
              <Icon
                aria-hidden="true"
                id={((SLIDE_MAP[currentSlide]?.icon || "list") + "-48") as IconIds}
              />
              <Title asChild>
                <h2>{currentSlide}</h2>
              </Title>
            </hgroup>
            <div className={s.controls}>
              {currentSlide !== "Leaderboard" && (
                <InfoCard currentSlide={currentSlide} />
              )}
              <div>
                <Button
                  aria-controls="lSlide"
                  intent="primary"
                  size="lrg"
                  iconBtn
                  onClick={() => handleTransition(setSearchParams, "left")}
                >
                  <Icon aria-label="Move Left" id="expand-22" />
                </Button>
                <Button
                  aria-controls="lSlide"
                  intent="primary"
                  size="lrg"
                  iconBtn
                  onClick={() => handleTransition(setSearchParams, "right")}
                >
                  <Icon aria-label="Move Right" id="expand-22" />
                </Button>
              </div>
            </div>
          </div>
  
          {/* Slide */}
          {SlideComponent ? <SlideComponent setRenewsIn={setRenewsIn} /> : <p>Slide not found.</p>}

          <div>
            {currentSlide !== "Leaderboard" && (
              <div className={s.timer}>
                <span id="renew">Renews in</span>{" "}
                <time ref={renewRef} dateTime={renewsIn}>{renewsIn}</time>
              </div>
            )}

            <div
              role="group"
              aria-label="Slide Indicators"
              className={s.indicators}
            >
              {Object.entries(SLIDE_MAP).map(([slide, obj]) => {
                const currSlide = slide === currentSlide;

                return (
                  <Button
                    key={slide}
                    size="sm"
                    iconBtn
                    aria-pressed={currSlide}
                    disabled={currSlide}
                    onClick={() =>
                      setSearchParams((params) => {
                        params.set(ModalQueryKey.MENU_MODAL, slide);
                        return params;
                      })
                    }
                  >
                    <Icon
                      aria-label={`${slide} Slide ${currSlide ? "Active" : "Inactive"}`}
                      id={((obj.icon || "list") + "-20") as IconIds}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </ModalTemplate>
  );
}

function InfoCard({ currentSlide }: { currentSlide: MenuSlide }) {
  const [keepInfoOpen, setSeepInfoOpen] = useState(false);

  return (
    <HoverCard
      id="slideInfo"
      className={s.infoCard}
      Trigger={
        <Button
          aria-controls="slideInfo"
          aria-expanded={keepInfoOpen ? "true" : "false"}
          aria-pressed={keepInfoOpen}
          intent="secondary"
          size="lrg"
          className={s.info}
          onClick={() => setSeepInfoOpen(!keepInfoOpen)}
        >
          <Icon aria-hidden="true" id="info-21" /> Info
        </Button>
      }
      open={keepInfoOpen || undefined}
      openDelay={keepInfoOpen ? 0 : 500}
    >
      {({ Arrow }) => (
        <>
          <Arrow />
          <h3>{currentSlide} Info</h3>
          <p>{currentSlide} renew with new {currentSlide?.toLowerCase()} every 2 weeks.</p>
          <ScrollArea orientation="vertical">
            <ul id="stepsList" aria-label="Steps">
              {SLIDE_MAP[currentSlide]?.steps!.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </ScrollArea>
        </>
      )}
    </HoverCard>
  )
}

MenuModal.restricted = "loggedOut";
