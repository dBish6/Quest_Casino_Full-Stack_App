import type { BreakpointContextValues } from "@components/dashboard/Breakpoint";

import { useLocation } from "react-router-dom";

import { Icon, Link } from "@components/common";
import { ModalTrigger } from "@components/modals";
import { Select } from "@components/common/controls";

import s from "./nav.module.css";

export default function Nav({ viewport }: { viewport: BreakpointContextValues["viewport"] }) {
  const location = useLocation();

  return (
    <div className={s.container}>
      <Divider heading="Profile" divide={false} />
      <nav>
        <div>
          <Link
            {...(location.pathname.match(/^\/profile(\/)?$/) && {
              "aria-current": "page"
            })}
            to="/profile"
          >
            <Icon aria-hidden="true" id={viewport === "small" ? "edit-14" : "edit-16"} /> Edit Profile
          </Link>
          <Link to="/profile/settings" nav>
            <Icon aria-hidden="true" id={viewport === "small" ? "adjust-14" : "adjust-16"} /> Settings
          </Link>
        </div>

        <Divider heading="Menu" />
        <div className={s.menu}>
          <Link
            to={{ pathname: "/home", hash: "games" }}
            {...(location.hash.includes("games") && { "aria-current": "location" })}
          >
            <Icon aria-hidden="true" id={viewport === "small" ? "joystick-14" : "joystick-16"} /> Games
          </Link>

          <ModalTrigger query={{ param: "menu", value: "Leaderboard" }}>
            <Icon aria-hidden="true" id={viewport === "small" ? "list-14" : "list-16"} /> Leaderboard
          </ModalTrigger>
          <ModalTrigger query={{ param: "menu", value: "Quests" }}>
            <Icon aria-hidden="true" id={viewport === "small" ? "scroll-14" : "scroll-16"} /> Quests
          </ModalTrigger>
          <ModalTrigger query={{ param: "menu", value: "Bonuses" }}>
            <Icon aria-hidden="true" id={viewport === "small" ? "gift-14" : "gift-16"} /> Bonuses
          </ModalTrigger>
        </div>
      </nav>

      <Languages viewport={viewport} />

      <Divider />
      <nav>
        <div>
          <Link to={{ pathname: "/about" }}>About Us</Link>
          <Link to="/support">Contact Support</Link>
        </div>
        <div>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy-policy">Private Policy</Link>
        </div>
      </nav>
    </div>
  );
}

function Divider({ heading, divide = true }: { heading?: string, divide?: boolean }) {
  const Line = divide ? "hr" : "div"

  return (
    <div className={s.divider}>
      <Line className={s.line} />
      {heading && <h4>{heading}</h4>}
    </div>
  );
}

/* TODO: Languages */
function Languages({ viewport }: { viewport: BreakpointContextValues["viewport"] }) {
  return (
    <>
      <Divider heading="Language" />
      <Select
        label="Language"
        intent="primary"
        size={viewport === "small" ? "md" : "lrg"}
        id="languageSelect"
        // Loader={() => <Spinner intent="primary" size="sm" />}
        // loaderTrigger={countriesLoading}
        // disabled={countriesLoading}
        // onFocus={() => {
        //   getCountries();
        // }}
      >
        <option value="English">English</option>
      </Select>
    </>
  );
}
