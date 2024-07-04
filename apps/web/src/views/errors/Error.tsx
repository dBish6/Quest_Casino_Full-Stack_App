import { useEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { useLogoutMutation } from "@authFeat/services/authApi";

import { Main } from "@components/dashboard";

import s from "./errors.module.css";

export interface ErrorPageProps {
  status: number;
  title: string;
  description: string;
}

const LOGOUT_STATUSES = new Set([401, 403]);

export default function Error({ status, title, description }: ErrorPageProps) {
  const user = useAppSelector(selectUserCredentials);
  
  if (user && LOGOUT_STATUSES.has(status)) {
    const [logout] = useLogoutMutation();

    useEffect(() => {
      const docStyle = document.documentElement.style;
      docStyle.pointerEvents = "none";
      docStyle.cursor = "wait";

      logout({ username: user!.username }).finally(() => {
        docStyle.pointerEvents = "";
        docStyle.cursor = "";
      });
    }, []);
  }

  return (
    <Main className={s.error}>
      <hgroup role="group" aria-roledescription="heading group">
        <h2>
          Error {status}: <span>{title}</span>
        </h2>
        <p aria-roledescription="subtitle">{description}</p>
      </hgroup>
    </Main>
  );
}
