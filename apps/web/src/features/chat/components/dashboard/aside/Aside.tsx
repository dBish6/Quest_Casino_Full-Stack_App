import type { Variants} from "framer-motion";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  useMotionValue,
  useDragControls,
  AnimatePresence,
  m,
} from "framer-motion";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import Friends from "./Friends";
import Chat from "./chat/Chat";
import { Button } from "@components/common/controls";
import { Icon, Link } from "@components/common";

import s from "./aside.module.css";

const shrinkInOut: Variants = {
  default: {
    width: "222px",
    maxWidth: "none",
    transition: { type: "spring", duration: 0.85 },
    // transitionEnd: {
    //   position: "initial",
    // },
  },
  enlarged: (x) => {
    return {
      // FIXME: Position when closing.
      // position: "absolute",
      width: "100vw",
      maxWidth: "945px",
      transition: { type: "spring", duration: 0.85 },
      // transition: {
      //   y: { type: "spring", stiffness: 50 },
      //   opacity: { ease: "easeInOut", duration: 1 },
      // },
    };
  },
  shrunk: (x) => {
    return {
      width: "82px",
      maxWidth: "none",
      transition: { type: "spring", duration: 0.85 },
      // transitionEnd: {
      //   position: "initial",
      // },
    };
  },
};

export default function Aside() {
  const [searchParams, setSearchParams] = useSearchParams(),
    state = searchParams.get("aside");

  const x = useMotionValue(0),
    controls = useDragControls();

  const user = useAppSelector(selectUserCredentials);

  // prettier-ignore
  useEffect(() => {
    const elems = document.querySelectorAll("#dashHeader, #asideLeft, main");
    for (const elem of elems) {
      if (state === "enlarged") elem.setAttribute("aria-hidden", "true")
      else elem.removeAttribute("aria-hidden")
    }
  }, [state]);

  return (
    <>
      {state === "enlarged" && (
        // FIXME: exit??????
        <AnimatePresence>
          <m.div
            className={s.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 1 }}
          />
        </AnimatePresence>
      )}
      <aside id="asideRight" className={s.aside}>
        <m.div
          id="asideDrawer"
          className={s.drawer}
          variants={shrinkInOut}
          initial="default"
          animate={state || "default"}
          custom={x}
          drag="x"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          // onDrag={(e) => console.log(x.get())}
          onDragEnd={() => {
            const position = x.get();

            if (state === "shrunk") {
              if (position <= -83) {
                searchParams.set("aside", "enlarged");
              } else if (position <= -22.5) {
                searchParams.delete("aside");
              }
            } else if (state === "enlarged") {
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
          data-state={state || "default"}
        >
          <Button
            aria-label="Drag Panel"
            aria-controls="asideDrawer"
            aria-expanded={state === "enlarged"}
            className={s.dragger}
            onPointerDown={(e) => controls.start(e)}
          >
            <div />
          </Button>

          <div className={s.content}>
            <hgroup className={s.head}>
              <Icon aria-hidden="true" id="user-24" />
              <h3 aria-label="Your Friends">Friends</h3>
            </hgroup>

            {user ? (
              <Friends />
            ) : (
              <span style={{ alignSelf: "center", textAlign: "center" }}>
                <Link intent="primary" to={{ search: "?login1=true" }}>
                  Log In
                </Link>{" "}
                to see friends.
              </span>
            )}

            <Chat />
          </div>
        </m.div>
      </aside>
    </>
  );
}
