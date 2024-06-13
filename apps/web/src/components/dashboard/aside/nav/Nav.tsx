import { useLocation } from "react-router-dom";

import { Icon } from "@components/common/icon";
import { Link } from "@components/common/link";
import { MenuModal } from "@components/modals";
import { Select } from "@components/common/controls";

import s from "./nav.module.css";

export default function Nav() {
  const location = useLocation();

  return (
    <div className={s.container}>
      <Divider heading="Profile" divide={false} />
      <nav>
        <div>
          <Link to="/profile" nav>
            <Icon aria-hidden="true" id="edit-16" /> Edit Profile
          </Link>
          <Link to="/profile/settings" nav>
            <Icon aria-hidden="true" id="adjust-16" /> Settings
          </Link>
        </div>

        <Divider heading="Menu" />
        <div className={s.menu}>
          <Link
            to={{ hash: "#games" }}
            data-current={location.hash.includes("games")}
          >
            <Icon aria-hidden="true" id="joystick-16" /> Games
          </Link>
          <MenuModal queryKey="menu" slide="1" />
          <MenuModal queryKey="menu" slide="2" />
          <MenuModal queryKey="menu" slide="3" />
        </div>
      </nav>

      <Languages />

      <Divider />
      <nav>
        <div>
          <Link to="/about">About Us</Link>
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

// prettier-ignore
function Divider({ heading, divide = true }: { heading?: string, divide?: boolean }) {
  const Line = divide ? "hr" : "div"

  return (
    <div className={s.divider}>
      {heading && <h4>{heading}</h4>}
      <Line className={s.line} />
    </div>
  );
}

/* TODO: Languages */
function Languages() {
  return (
    <>
      <Divider heading="Language" />
      <Select
        label="Language"
        intent="primary"
        size="lrg"
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
