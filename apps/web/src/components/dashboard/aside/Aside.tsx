import CURRENT_YEAR from "@constants/CURRENT_YEAR";

import useUser from "@authFeat/hooks/useUser";

import { useLogoutMutation } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link, Icon, Blob } from "@components/common";
import { ModalTrigger } from "@components/modals";
import { Button } from "@components/common/controls";
import Nav from "./nav/Nav";

import s from "./aside.module.css";

export default function Aside() {
  const user = useUser(),
    [postLogout] = useLogoutMutation();

  return (
    <aside id="asideLeft" className={s.aside}>
      <Blob svgWidth={220.83} svgHeight={201.251}>
        <path
          d="M60.948.052c83.669 3.076 163.868-13.232 156.264 47.371s26.97 105.978-29.53 150.728c-32.606 1.846-36.1-2.475-83.159-5.79s-56.909 30.654-82.672-15.83S-22.721-3.024 60.948.052Z"
          fill="rgba(178,67,178,0.6)"
        />
      </Blob>
      <div className={s.inner}>
        <ScrollArea orientation="vertical">
          <div className={s.user}>
            <Avatar size="xxl" {...(user && { user: { avatar_url: user.avatar_url } })} />

            <div className={s.details}>
              {user && (
                <>
                  <h3 title={user.username}>{user.username}</h3>
                  <div>
                    <span className={s.wins}>
                      <span>{user.statistics.wins.total}</span> Wins
                    </span>
                    <span className={s.divider} />
                    <span className={s.streak}>
                      <span>{user.statistics.wins.streak}</span> Streak
                    </span>
                  </div>
                </>
              )}

              <div className={s.log} data-user={user ? "online" : "offline"}>
                <span />
                {user ? (
                  <Link asChild intent="primary" to="">
                    <Button onClick={() => postLogout({ username: user!.username })}>Logout</Button>
                  </Link>
                ) : (
                  <ModalTrigger queryKey="login" intent="primary">
                    Login
                  </ModalTrigger>
                )}
              </div>
            </div>
          </div>

          <Nav />
        </ScrollArea>

        <footer>
          <div>
            <Link to="https://www.facebook.com/" external>
              <Icon id="facebook-18" />
            </Link>
            <Link to="https://www.instagram.com/" external>
              <Icon id="instagram-18" />
            </Link>
            <Link to="https://discord.com/" external>
              <Icon id="discord-20" />
            </Link>
          </div>
          <small>
            Copyright © <time dateTime={CURRENT_YEAR}>{CURRENT_YEAR}</time> Quest
            Casino
          </small>
        </footer>
      </div>
    </aside>
  );
}
