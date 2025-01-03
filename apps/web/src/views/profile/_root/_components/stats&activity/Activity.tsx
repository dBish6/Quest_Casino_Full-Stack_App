import type { UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { UserGameHistory } from "@authFeat/components/userActivity";

import s from "../../profile.module.css";

interface ProfileActivityProps {
  user: UserProfileCredentials;
}

export default function Activity({ user }: ProfileActivityProps) {
  return (
    <section aria-labelledby="hUsrHistory" className={s.activity}>
      <UserGameHistory gameHistory={user.activity.game_history} />
    </section>
  );
}
