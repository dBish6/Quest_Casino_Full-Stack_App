import { Main } from "@components/dashboard";
import { Link } from "@components/common";

import s from "./support.module.css";

export default function Support() {
  return (
    <Main className={s.support}>
      <p>
        Need help? Have a question, need assistance, or want to share feedback?
        Contact our support team via email or use our live support chat. We're
        here to help.
      </p>
      <ul>
        <li>
          Email:{" "}
          <Link intent="primary" to="mailto:davidbish2002@hotmail.com" external>
            davidbish2002@hotmail.com
          </Link>
        </li>
        <li>
          Live support chat coming in the future.
        </li>
      </ul>
    </Main>
  );
}
