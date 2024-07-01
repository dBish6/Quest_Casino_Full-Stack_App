import { Main } from "@components/dashboard";
import s from "./errors.module.css"

export interface ErrorPageProps {
    status: number;
    title: string;
    description: string;
}

export default function Error({ status, title, description }: ErrorPageProps) {
  return (
    <Main className={s.error}>
      <hgroup role="group" aria-roledescription="Heading Group">
        <h2>
          Error {status}: <span>{title}</span>
        </h2>
        <p aria-roledescription="subtitle">{description}</p>
      </hgroup>
    </Main>
  );
}
