import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { history } from "@utils/History";

import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { attemptLogout } from "@authFeat/services/handleLogout";

import { Main } from "@components/dashboard";
import { Button } from "@components/common/controls";
import { Link } from "@components/common";

import s from "./errors.module.css";

export interface ErrorPageProps {
  status: number;
  title: string;
  description: string;
}

const LOGOUT_STATUSES = new Set([401, 403]);

export default function Error({ status, title, description }: ErrorPageProps) {
  const [_, setSearchParams] = useSearchParams(),
    user = useAppSelector(selectUserCredentials),
    dispatch = useAppDispatch();

  if (user && LOGOUT_STATUSES.has(status)) {
    useEffect(() => {
      attemptLogout(dispatch, user.username, setSearchParams);
    }, []);
  }

  return (
    <Main className={s.error} {...(title === "Application Error" && { style: { height: "100vh" } })}>
      <hgroup role="group" aria-roledescription="heading group">
        <h2>
          Error {status}: <span>{title}</span>
        </h2>
        <p aria-roledescription="subtitle">{description}</p>
      </hgroup>

      {[500, 404].includes(status) && (
        <Button
          intent="primary"
          size="xl"
          {...(title.includes("Page")
            ? {
                asChild: true
              }
            : {
                onClick: () => history.replacePath("/home")
              })}
        >
          {title.includes("Page") ? (
            <Link aria-label="Quest Casino Home" to="/home">Home</Link>
          ) : (
            "Refresh"
          )}
        </Button>
      )}
    </Main>
  );
}
