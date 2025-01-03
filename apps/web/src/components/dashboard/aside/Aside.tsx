import type { Variants } from "framer-motion";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAnimate, AnimatePresence, m } from "framer-motion";

import CURRENT_YEAR from "@constants/CURRENT_YEAR";

import useBreakpoint from "@hooks/useBreakpoint";
import useUser from "@authFeat/hooks/useUser";

import { useLogoutMutation } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link, Icon, Blob } from "@components/common";
import { ModalTrigger } from "@components/modals";
import { Button } from "@components/common/controls";
import Nav from "./nav/Nav";

import s from "./aside.module.css";

const ANIMATION_DURATION = 850,
  shrinkInOut: Variants = {
    hidden: {
      width: 0,
      x: -2,
      transition: {
        width: { type: "spring", duration: ANIMATION_DURATION / 1000 },
        x: { duration: 0.1 }
      }
    },
    visible: {
      width: "100%",
      x: 0,
      transition: {
        type: "spring",
        duration: ANIMATION_DURATION / 1000
      }
    }
  };

export default function Aside() {
  const { viewport } = useBreakpoint();

  const [searchParams, setSearchParams] = useSearchParams(),
    hamOpen = searchParams.get("ham") || viewport === "large",
    [scope, animate] = useAnimate<HTMLDivElement>();

  const user = useUser(),
    [postLogout] = useLogoutMutation();

  useEffect(() => {
    if (scope.current)
      animate(scope.current,
        { opacity: hamOpen ? [0, 1] : [1, 0] },
        { opacity: { duration: ANIMATION_DURATION / 1000 - (hamOpen ? .33 : .7) } }
      );
  }, [hamOpen]);

  return (
    <AnimatePresence>
      {hamOpen && (
        <m.aside
          id="asideLeft"
          className={s.aside}
          variants={shrinkInOut}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onPan={(e, info) => {
            if (e.pointerType !== "mouse") {
              // TODO: Check this actually on a phone.
              const threshold = 75;
              if (info.delta.x < -threshold)
                setSearchParams((params) => {
                  params.delete("ham");
                  return params;
                });
            }
          }}
        >
          <Blob svgWidth={220.83} svgHeight={201.251}>
            <path
              d="M60.948.052c83.669 3.076 163.868-13.232 156.264 47.371s26.97 105.978-29.53 150.728c-32.606 1.846-36.1-2.475-83.159-5.79s-56.909 30.654-82.672-15.83S-22.721-3.024 60.948.052Z"
              fill="rgba(178,67,178,0.6)"
            />
          </Blob>
          <div className={s.inner}>
            <m.div ref={scope}>
              <ScrollArea orientation="vertical">
                {["medium", "small"].includes(viewport) && (
                  <Button
                    intent="exit ghost"
                    size="md"
                    className={s.exit}
                    onClick={() =>
                      setSearchParams((params) => {
                        params.delete("ham");
                        return params;
                      })
                    }
                  />
                )}

                <div className={s.user}>
                  <Avatar
                    size={viewport === "small" ? "lrg" : "xxl"}
                    {...(user && { user: { avatar_url: user.avatar_url } })}
                  />

                  <div className={s.details}>
                    {user && (
                      <>
                        <h3 title={user.username}>{user.username}</h3>
                        <div>
                          <span title={`${user.statistics.wins.total} Total Wins`} className={s.wins}>
                            <span>{user.statistics.wins.total}</span> Wins
                          </span>
                          <span className={s.divider} />
                          <span title={`${user.statistics.wins.streak} Win Streak`} className={s.streak}>
                            <span>{user.statistics.wins.streak}</span> Streak
                          </span>
                        </div>
                      </>
                    )}

                    <div className={s.log} data-user={user ? "online" : "offline"}>
                      <span />
                      {user ? (
                        <Link asChild intent="primary" to="">
                          <Button
                            onClick={() => postLogout({ username: user!.username })}
                          >
                            Logout
                          </Button>
                        </Link>
                      ) : (
                        <ModalTrigger query={{ param: "login" }} intent="primary">
                          Login
                        </ModalTrigger>
                      )}
                    </div>
                  </div>
                </div>

                <Nav viewport={viewport} />
              </ScrollArea>

              <footer>
                <div>
                  <Link to="https://www.facebook.com/" external>
                    <Icon id={viewport === "small" ? "facebook-16" : "facebook-18"} />
                  </Link>
                  <Link to="https://www.instagram.com/" external>
                    <Icon id={viewport === "small" ? "instagram-16" : "instagram-18"} />
                  </Link>
                  <Link to="https://discord.com/" external>
                    <Icon id={viewport === "small" ? "discord-18" : "discord-20"} />
                  </Link>
                </div>
                <small>
                  Copyright © <time dateTime={CURRENT_YEAR}>{CURRENT_YEAR}</time>{" "}
                  Quest Casino
                </small>
              </footer>
            </m.div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
