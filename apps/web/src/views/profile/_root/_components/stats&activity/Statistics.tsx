import type { UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { Icon } from "@components/common";
import { UserStatistics } from "@authFeat/components/userStatistics";

import s from "../../profile.module.css";

interface ProfileActivityProps {
  user: UserProfileCredentials;
}

export default function Statistics({ user }: ProfileActivityProps) {
  return (
    <section aria-labelledby="hStatistics" className={s.statistics}>
      <hgroup className={s.title}>
        <Icon aria-hidden="true" id="bar-chart-38" scaleWithText />
        <h2 id="hPersonal">Statistics</h2>
      </hgroup>

      <UserStatistics
        intent="table"
        stats={user.statistics}
        username={user.username}
        scaleText
      />
    </section>
  );
}
