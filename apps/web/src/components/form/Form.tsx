import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { forwardRef } from "react";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { Link } from "@components/common/link";

import s from "./form.module.css";

export interface FormProps
  extends Omit<React.ComponentProps<"form">, "aria-errormessage"> {
  formLoading: boolean;
  resSuccessMsg: any;
  resError: FetchBaseQueryError | SerializedError | undefined;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  // TODO:
  ErrorsAsToasts?: boolean;
}

const Form = forwardRef<HTMLFormElement, React.PropsWithChildren<FormProps>>(
  ({ children, formLoading, resSuccessMsg, resError, ...props }, ref) => {
    return (
      <>
        {!formLoading &&
          (resSuccessMsg ? (
            <span className={s.successMsg}>{resSuccessMsg}</span>
          ) : (
            resError &&
            (isFetchBaseQueryError(resError) ? (
              resError.status === 409 &&
              typeof resError.data?.ERROR === "string" ? (
                <span role="alert" id="globalFormError" className={s.errorMsg}>
                  {resError.data?.ERROR}
                </span>
              ) : (
                (resError.status >= 500 ||
                  (typeof resError.data?.ERROR === "string" &&
                    resError.data?.ERROR.startsWith("No form field"))) && (
                  <span
                    role="alert"
                    id="globalFormError"
                    className={s.errorMsg}
                  >
                    An unexpected server error occurred. Please try refreshing
                    the page. If the error persists, feel free to reach out to{" "}
                    <Link intent="primary" to="/support">
                      support
                    </Link>
                    .
                  </span>
                )
              )
            ) : (
              <span role="alert" id="globalFormError" className={s.errorMsg}>
                {resError.message}. If the error persists, feel free to reach
                out to{" "}
                <Link intent="primary" to="/support">
                  support
                </Link>
                .
              </span>
            ))
          ))}
        <form
          ref={ref}
          {...(resError && { "aria-errormessage": "globalFormError" })}
          autoComplete="off"
          noValidate
          {...props}
        >
          {children}
        </form>
      </>
    );
  }
);

export default Form;
