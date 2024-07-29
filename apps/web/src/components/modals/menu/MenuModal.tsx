import type { IconIds, LinkProps } from "@components/common";

import { Title } from "@radix-ui/react-dialog";

import { ModalTemplate, ModalQueryKey } from "@components/modals";
import { Link, Icon } from "@components/common";
import { Button } from "@components/common/controls";

import s from "./menuModal.module.css";

const triggerDefaults: Record<string, { title: string; icon: IconIds }> = {
  "1": { title: "Leaderboard", icon: "list-16" },
  "2": { title: "Quests", icon: "scroll-16" },
  "3": { title: "Bonuses", icon: "gift-16" },
};

export interface MenuModalProps extends Omit<LinkProps, "to"> {
  queryKey: string;
  // slide: "1" | "2" | "3";
  slide: "Leaderboard" | "Quests" | "Bonuses";
}

// export const SLIDES = ["Leaderboard", "Quests", "Bonuses"] as const;

// TODO:
export default function MenuModal({
  // children,
  // queryKey,
  // slide,
  // ...props
}) {
  // const initialSlide = triggerDefaults[slide].title;

  return (
    <ModalTemplate
      aria-description="..."
      // queryKey={`${queryKey}${slide}`}
      queryKey={ModalQueryKey.MENU_MODAL}
      width="768px"
      className={s.modal}
      // onCloseAutoFocus={() => setErrors({})}
    >
      {() => (
        <>
          <div className="head">
            <hgroup>
              {/* Changes on slides. */}
              {/* <Icon aria-hidden="true" id="enter-45" /> */}
              <Title asChild>
                <h2>Cash In</h2>
              </Title>
            </hgroup>
            <div className={s.controls}>
              <Button>
                <Icon aria-hidden="true" id="info-21" /> Info
              </Button>
              <div>
                <Button aria-controls="" intent="primary" size="lrg" iconBtn>
                  <Icon aria-label="Move Left" id="expand-22" />
                </Button>
                <Button aria-controls="" intent="primary" size="lrg" iconBtn>
                  <Icon aria-label="Move Right" id="expand-22" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slide */}

          <div>
            <div>
              <span id="renew">Renews in</span>
              <time dateTime="2024-11-18T14:00:00Z">15:32:59</time>
            </div>
            <div className={s.indicators}>
              <Button size="sm" iconBtn>
                <Icon aria-label="Leaderboard" id="list-20" />
              </Button>
              <Button size="sm" iconBtn>
                <Icon id="scroll-20" />
              </Button>
              <Button size="sm" iconBtn>
                <Icon id="gift-20" />
              </Button>
            </div>
          </div>
        </>
      )}
    </ModalTemplate>
  );
}
