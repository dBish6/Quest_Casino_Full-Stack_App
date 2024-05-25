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
            resError && (
              <span role="alert" id="globalFormError" className={s.errorMsg}>
                {isFetchBaseQueryError(resError) ? (
                  resError.status === 400 ? (
                    resError.data?.message
                  ) : (
                    <>
                      An unexpected server error occurred. Please try refreshing
                      the page. If the error persists, feel free to reach out to{" "}
                      <Link intent="primary" to="/support">
                        support
                      </Link>
                      .
                    </>
                  )
                ) : (
                  <>
                    {resError.message} If the error persists, feel free to reach
                    out to{" "}
                    <Link intent="primary" to="/support">
                      support
                    </Link>
                    .
                  </>
                )}
              </span>
            )
          ))}
        <form
          ref={ref}
          aria-errormessage="globalFormError"
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
