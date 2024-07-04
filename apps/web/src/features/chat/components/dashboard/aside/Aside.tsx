import type { Variants } from "framer-motion";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  useMotionValue,
  useDragControls,
  AnimatePresence,
  m,
} from "framer-motion";

import { fadeInOut } from "@utils/animations";

import useUser from "@authFeat/hooks/useUser";

import Friends from "./Friends";
import Chat from "./chat/Chat";
import { Button } from "@components/common/controls";
import { Icon, Link } from "@components/common";

import s from "./aside.module.css";

const dragPoints: Variants = {
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
      // position: "absolute",
      width: "100vw",
      maxWidth: "945px",
      transition: { type: "spring", duration: 0.85 },
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

// Could use this for width?
// onPan={(e, info) => containerY.set(info.offset.y)}

// FIXME: Keyboard (Arrow Keys).
export default function Aside() {
  const [searchParams, setSearchParams] = useSearchParams(),
    state = searchParams.get("aside") || "default";

  const x = useMotionValue(0),
    controls = useDragControls(),
    fadeVariant = fadeInOut();

  const user = useUser();

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
      <AnimatePresence>
        {state === "enlarged" && (
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
          // role="group"
          aria-roledescription="Drawer"
          id="asideDrawer"
          className={s.drawer}
          variants={dragPoints}
          initial="default"
          animate={state}
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
          data-state={state}
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
            {state === "enlarged" ? (
              <>{/* <EnlargedChat />? <FocusedChat />? */}</>
            ) : (
              <>
                <hgroup className={s.head}>
                  <div
                    role="presentation"
                    {...(!searchParams.has("chat") && {
                      role: "button",
                      tabIndex: 0,
                      "aria-label": "Show Friends",
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

                {user ? (
                  <Friends user={user} />
                ) : (
                  <span style={{ alignSelf: "center", textAlign: "center" }}>
                    <Link intent="primary" to={{ search: "?login1=true" }}>
                      Log In
                    </Link>{" "}
                    to see friends.
                  </span>
                )}

                <Chat user={user} />
              </>
            )}
          </div>
        </m.div>
      </aside>
    </>
  );
}
