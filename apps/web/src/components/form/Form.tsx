import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { forwardRef, useEffect } from "react";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { Link } from "@components/common";

import s from "./form.module.css";

export interface FormProps
  extends Omit<React.ComponentProps<"form">, "aria-errormessage"> {
  formLoading: boolean;
  resSuccessMsg?: any;
  resError: FetchBaseQueryError | SerializedError | undefined;
  clearErrors?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = forwardRef<HTMLFormElement, React.PropsWithChildren<FormProps>>(
  ({ children, formLoading, resSuccessMsg, resError, clearErrors, ...props }, ref) => {
    useEffect(() => {
      if (resSuccessMsg && clearErrors) clearErrors();
    }, [resSuccessMsg]);

    return (
      <>
        {!formLoading &&
          (resSuccessMsg ? (
            <span className={s.successMsg}>{resSuccessMsg}</span>
          ) : (
            resError &&
            (isFetchBaseQueryError(resError) ? (
              typeof resError.data?.ERROR === "string" &&
              [400, 401, 404, 409].includes((resError.status as number)) ? (
                <span role="alert" id="globalFormError" className={s.errorMsg}>
                  {resError.data?.ERROR}
                </span>
              ) : (
                ((resError.status as number) >= 500 ||
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
                {resError.message || "Serialization error"}. If the error
                persists, feel free to reach out to{" "}
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
