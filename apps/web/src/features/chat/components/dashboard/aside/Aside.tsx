import type { Variants } from "framer-motion";

import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMotionValue, useDragControls, AnimatePresence, m } from "framer-motion";

import { fadeInOut } from "@utils/animations";

import useUser from "@authFeat/hooks/useUser";

import { Friends } from "./friends";
import { Chat } from "./chat";
import { Button } from "@components/common/controls";
import { Icon } from "@components/common";

import s from "./aside.module.css";

export type DragPointsKey = "default" | "enlarged" | "shrunk";

export const ANIMATION_DURATION = 850;
const dragPoints: Variants = {
  default: {
    width: "222px",
    maxWidth: "none",
    transition: { type: "spring", duration: ANIMATION_DURATION / 1000 },
    // transitionEnd: {
    //   position: "initial",
    // },
  },
  enlarged: (x) => {
    return {
      // position: "absolute",
      width: "100vw",
      maxWidth: "945px",
      transition: { type: "spring", duration: ANIMATION_DURATION / 1000 },
    };
  },
  shrunk: (x) => {
    return {
      // TODO: For phone just shrunk or enlarged.
      // width: "82px",
      width: "9px",
      maxWidth: "none",
      transition: { type: "spring", duration: ANIMATION_DURATION / 1000 },
      // transitionEnd: {
      //   position: "initial",
      // },
    };
  },
};

// Could use this for width?
// onPan={(e, info) => containerY.set(info.offset.y)}

const keyboardTrap = (e: KeyboardEvent, focusableElems: HTMLElement[]) => {
  if (e.key === "Tab") {
    const firstElem = focusableElems[0];
    let lastElem = focusableElems[focusableElems.length - 1]; // The last element is the send button.
    while (lastElem && lastElem.hasAttribute("disabled")) {
      const prevIndex = focusableElems.indexOf(lastElem) - 1;
      lastElem = focusableElems[prevIndex];
    }

    if (e.shiftKey && document.activeElement === firstElem) {
      e.preventDefault();
      firstElem.focus();
    } else if (!e.shiftKey && document.activeElement === lastElem) {
      e.preventDefault();
      lastElem.focus();
    }
  }
};

// FIXME: Keyboard (Arrow Keys).
export default function Aside() {
  const [searchParams, setSearchParams] = useSearchParams(),
    asideState = (searchParams.get("aside") || "default") as DragPointsKey;

  const asideDrawerRef = useRef<HTMLDivElement>(null),
    keyboardTrapRef = useRef<(e: KeyboardEvent) => void>(() => {});

  // TODO: Nice transition from enlarged to default.
  const [lazyShow, setLazyShow] = useState(false);

  const x = useMotionValue(0),
    controls = useDragControls(),
    fadeVariant = fadeInOut();

  const user = useUser(),
    friendsListArr = useMemo(() => Object.values(user?.friends.list || {}), [user?.friends.list]);

  // NOTE: No need to clear eventListeners on unmount because this component will always be on screen, can't anyways.
  useEffect(() => {
    // Hides all content for screen readers when aside is enlarged.
    const elems = document.querySelectorAll("#dashHeader, #asideLeft, main");
    for (const elem of elems) {
      if (asideState === "enlarged") elem.setAttribute("aria-hidden", "true")
      else elem.removeAttribute("aria-hidden")
    }

    // Traps keyboard navigation inside the aside when it's enlarged.
    if (asideState === "enlarged") {
      const focusableElems = Array.from(
        asideDrawerRef.current!.querySelectorAll<HTMLElement>(
          `button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])`
        )
      );
    
      keyboardTrapRef.current = (e: KeyboardEvent) => keyboardTrap(e, focusableElems);
      asideDrawerRef.current!.addEventListener("keydown", keyboardTrapRef.current);
    } else {
      asideDrawerRef.current!.removeEventListener("keydown", keyboardTrapRef.current);
    }
  }, [asideState]);

  useEffect(() => {
    if (asideState !== "enlarged") {
      setTimeout(() => {
        setLazyShow(true);
      }, ANIMATION_DURATION - 350);
    } else {
      setLazyShow(false)
    }
  }, [asideState]);

  return (
    <>
      <AnimatePresence>
        {asideState === "enlarged" && (
          <m.div
            className={s.backdrop}
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>
      <aside id="asideRight" className={s.aside}>
        <m.div
          ref={asideDrawerRef}
          // role="group"
          aria-roledescription="drawer"
          id="asideDrawer"
          className={s.drawer}
          variants={dragPoints}
          initial="default"
          animate={asideState}
          custom={x}
          drag="x"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          // onDrag={(e) => console.log(x.get())}
          onDragEnd={() => {
            const position = x.get();

            if (asideState === "shrunk") {
              if (position <= -83) {
                searchParams.set("aside", "enlarged");
              } else if (position <= -22.5) {
                searchParams.delete("aside");
              }
            } else if (asideState === "enlarged") {
              if (position >= 148) {
                searchParams.set("aside", "shrunk");
              } else if (position >= 22.5) {
                searchParams.delete("aside");
              }
            } else {
              if (position >= 22.5) {
                searchParams.set("aside", "shrunk");
              } else if (position <= -22.5) {
                searchParams.set("aside", "enlarged");
              }
            }
            setSearchParams(searchParams);
          }}
          style={{ x }}
          data-aside-state={asideState}
        >
          <Button
            aria-label="Drag Panel"
            aria-controls="asideDrawer"
            aria-expanded={asideState === "enlarged"}
            className={s.dragger}
            onPointerDown={(e) => controls.start(e)}
          >
            <div />
          </Button>

          <div className={s.content}>
            {asideState !== "shrunk" && (asideState !== "enlarged" && lazyShow) && (
              <hgroup className={s.head}>
                <div
                  role="presentation"
                  {...(!searchParams.has("chat") && {
                    role: "button",
                    tabIndex: 0,
                    "aria-label": "Uncover Friends",
                    "aria-controls": "chat",
                    "aria-expanded": !searchParams.has("chat"),
                    onClick: () =>
                      setSearchParams((params) => {
                        params.set("chat", "shrunk");
                        return params;
                      }),
                  })}
                >
                  <Icon aria-hidden="true" id="user-24" />
                  <h3 aria-label="Your Friends">Friends</h3>
                </div>
              </hgroup>
            )}

            {asideState !== "shrunk" &&
              <Friends user={user} asideState={asideState} friendsListArr={friendsListArr} />
            }

            <Chat user={user} friendsListArr={friendsListArr} asideState={asideState} />
          </div>
        </m.div>
      </aside>
    </>
  );
}
