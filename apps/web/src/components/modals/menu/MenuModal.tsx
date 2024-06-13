import type { IconIds } from "@components/common/icon";
import type { LinkProps } from "@components/common/link";

import { Title } from "@radix-ui/react-dialog";

import { ModalTemplate } from "@components/modals";
import { Link } from "@components/common/link";
import { Button } from "@components/common/controls";
import { Icon } from "@components/common/icon";

import s from "./menuModal.module.css";

const triggerDefaults: Record<string, { title: string; icon: IconIds }> = {
  "1": { title: "Leaderboard", icon: "list-16" },
  "2": { title: "Quests", icon: "scroll-16" },
  "3": { title: "Bonuses", icon: "gift-16" },
};

export interface MenuModalProps extends Omit<LinkProps, "to"> {
  queryKey: string;
  slide: "1" | "2" | "3";
}

// TODO:
export default function MenuModal({
  queryKey,
  slide,
  ...props
}: MenuModalProps) {
  const initialSlide = triggerDefaults[slide].title;

  return (
    <ModalTemplate
      aria-description="..."
      queryKey={`${queryKey}${slide}`}
      width="768px"
      className={s.modal}
      //   onEscapeKeyDown={() => setErrors({})}
      Trigger={() => (
        <Link
          to={{
            search: `?${queryKey}${slide}=true&${initialSlide}=true`,
          }}
          {...props}
        >
          <Icon id={triggerDefaults[slide].icon} /> {initialSlide}
        </Link>
      )}
    >
      {({ close }) => (
        <>
          <Button
            intent="exit"
            size="xl"
            className="exitXl"
            onClick={() => {
              close();
              //   setErrors({});
            }}
          />

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
