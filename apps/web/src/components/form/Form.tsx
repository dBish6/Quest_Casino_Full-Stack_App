import type { FetcherWithComponents } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { forwardRef, useEffect } from "react";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { Link } from "@components/common";

import s from "./form.module.css";

export interface FormProps extends Omit<React.ComponentProps<"form">, "aria-errormessage"> {
  fetcher?: FetcherWithComponents<any>;
  formLoading: boolean;
  resSuccessMsg?: any;
  resError: FetchBaseQueryError | SerializedError | undefined;
  clearErrors?: () => void;
}

const Form = forwardRef<HTMLFormElement, React.PropsWithChildren<FormProps>>(
  ({ children, fetcher, formLoading, resSuccessMsg, resError, clearErrors, ...props }, ref) => {
    const FormElm = (fetcher ? fetcher.Form : "form") as React.ElementType<React.ComponentProps<"form">>;

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
        <FormElm
          ref={ref}
          {...(resError && { "aria-errormessage": "globalFormError" })}
          autoComplete="off"
          noValidate
          {...props}
        >
          {children}
        </FormElm>
      </>
    );
  }
);

export default Form;
