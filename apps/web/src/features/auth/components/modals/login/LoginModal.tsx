import type { LoginBodyDto } from "@qc/typescript/dtos/LoginBodyDto";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type NullablePartial from "@qc/typescript/typings/NullablePartial";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Content, Title } from "@radix-ui/react-dialog";

import { capitalize } from "@qc/utils";
import { isFormValidationError } from "@utils/forms";

import useForm from "@hooks/useForm";
import {
  useLoginMutation,
  useLoginGoogleMutation,
} from "@authFeat/services/authApi";

import ModalTemplate from "@components/modals/ModalTemplate";
import { Form } from "@components/form";
import { Button, Input } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Link } from "@components/common/link";
import { LoginWithGoogle } from "@authFeat/components/loginWithGoogle";
import { Spinner } from "@components/loaders";

import s from "./loginModal.module.css";

export default function LoginModal() {
  const location = useLocation();

  const { form, setLoading, setError, setErrors } = useForm<LoginBodyDto>();

  const [
    login,
    {
      // data: loginData,
      error: loginError,
      isLoading: loginLoading,
      isSuccess: loginSuccess,
    },
  ] = useLoginMutation();

  const [googleLoading, setGoogleLoading] = useState(false),
    [
      loginGoogle,
      {
        // data: loginGoogleData,
        error: loginGoogleError,
        isLoading: loginGoogleLoading,
        isSuccess: loginGoogleSuccess,
      },
    ] = useLoginGoogleMutation();

  const processingForm = loginLoading || form.processing,
    processing = processingForm || loginGoogleLoading || googleLoading;

  useEffect(() => {
    if (loginSuccess || loginGoogleSuccess) {
      (document.querySelector(".exitXl") as HTMLButtonElement).click();
      setErrors({});
    }
  }, [loginSuccess, loginGoogleSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement,
      fields = form.querySelectorAll<HTMLInputElement>("input");

    try {
      let reqBody: NullablePartial<LoginBodyDto> = {} as any;
      for (const field of fields) {
        const key = field.name as keyof LoginBodyDto;

        if (!field.value.length) {
          setError(key, `${capitalize(field.name)} is required.`);
          continue;
        }
        reqBody[key] = field.value || null;
      }

      if (Object.keys(reqBody).length === 2)
        login(reqBody as LoginBodyDto).then((res) => {
          // prettier-ignore
          if (isFormValidationError(res.error))
          return setErrors(
            ((res.error as FetchBaseQueryError).data?.ERROR as Record<string, string>) || {}
          );

          if (res.data?.message.endsWith("successfully.")) form.reset();
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate query="login" btnText="Log In" maxWidth="368px">
      {({ close, contentProps }) => (
        <Content
          className={`modal ${s.modal}`}
          aria-description="Login with your Quest Casino profile by providing the details below."
          onEscapeKeyDown={() => setErrors({})}
          {...contentProps}
        >
          <Button intent="exit" size="xl" className="exitXl" onClick={close} />

          <hgroup className="head">
            <Icon id="enter-45" />
            <Title asChild>
              <h2>Login</h2>
            </Title>
          </hgroup>

          <Form
            formLoading={processingForm}
            resError={loginError || loginGoogleError}
            clearErrors={() => setErrors({})}
            onSubmit={handleSubmit}
          >
            <div className="inputs">
              <Input
                label="Email or Username"
                intent="primary"
                size="lrg"
                id="email_username"
                name="email_username"
                required
                error={form.error.email_username}
                disabled={processing}
                onInput={() => setError("email_username", "")}
              />
              <Input
                label="Password"
                intent="primary"
                size="lrg"
                id="password"
                name="password"
                type="password"
                required
                error={form.error.password}
                disabled={processing}
                onInput={() => setError("password", "")}
              />
            </div>
            <Button
              aria-label="Log In"
              aria-live="polite"
              intent="primary"
              size="xl"
              type="submit"
              disabled={processing}
              style={{ opacity: googleLoading ? 0.48 : 1 }}
            >
              {processingForm ? (
                <Spinner intent="primary" size="md" />
              ) : (
                "Log In"
              )}
            </Button>

            <LoginWithGoogle
              loginGoogle={loginGoogle}
              setGoogleLoading={setGoogleLoading}
              processing={{
                google: googleLoading,
                form: processingForm,
                all: processing,
              }}
            />
          </Form>

          <span className={s.haveAcc}>
            Don't have an account?{" "}
            <Link intent="primary" to={`${location.pathname}?register=true`}>
              Register
            </Link>
          </span>
        </Content>
      )}
    </ModalTemplate>
  );
}
