import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { ScrollArea } from "@components/scrollArea";
import { Avatar } from "@components/common/avatar";
import { Link } from "@components/common/link";
import { LoginModal } from "@authFeat/components/modals";
import { Button } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Blob } from "@components/common/blob";
import Nav from "./nav/Nav";

import s from "./aside.module.css";

export default function Aside() {
  const user = useAppSelector(selectUserCredentials),
    btnTxt = user ? "Logout" : "Login";

  return (
    <aside className={s.aside}>
      <Blob svgWidth="220.83px" svgHeight="201.251px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 220.83 201.251"
          preserveAspectRatio="xMidYMin meet"
        >
          <path
            d="M60.948.052c83.669 3.076 163.868-13.232 156.264 47.371s26.97 105.978-29.53 150.728c-32.606 1.846-36.1-2.475-83.159-5.79s-56.909 30.654-82.672-15.83S-22.721-3.024 60.948.052Z"
            fill="rgba(178,67,178,0.6)"
          />
        </svg>
      </Blob>
      <div className={s.inner}>
        <ScrollArea orientation="vertical">
          <div className={s.user}>
            <Avatar size="xxl" />

            <div className={s.details}>
              {user && (
                <>
                  <h3>{user.username}</h3>
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

              <div className={s.log}>
                <span data-user={btnTxt} />
                {btnTxt === "Logout" ? (
                  <Button>{btnTxt}</Button>
                ) : (
                  <LoginModal queryKey="login1" />
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
          <small>Copyright © 2023 Quest Casino</small>
        </footer>
      </div>
    </aside>
  );
}
