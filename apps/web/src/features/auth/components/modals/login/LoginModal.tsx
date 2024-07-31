import type { LoginBodyDto } from "@qc/typescript/dtos/LoginBodyDto";
import type NullablePartial from "@qc/typescript/typings/NullablePartial";

import { useEffect, useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import { capitalize } from "@qc/utils";

import useForm from "@hooks/useForm";
import useSwitchModal from "@authFeat/hooks/useSwitchModal";
import { useLoginMutation, useLoginGoogleMutation } from "@authFeat/services/authApi";

import { ModalTemplate, ModalQueryKey } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input } from "@components/common/controls";
import { Icon, Link } from "@components/common";
import { LoginWithGoogle } from "@authFeat/components/loginWithGoogle";
import { Spinner } from "@components/loaders";

import s from "./loginModal.module.css";

export default function LoginModal() {
  const { form, setLoading, setError, setErrors } = useForm<LoginBodyDto>();
  const { handleSwitch } = useSwitchModal(ModalQueryKey.LOGIN_MODAL);

  const [
    postLogin,
    {
      error: loginError,
      isLoading: loginLoading,
      isSuccess: loginSuccess,
    },
  ] = useLoginMutation();

  const [googleLoading, setGoogleLoading] = useState(false),
    [
      postLoginGoogle,
      {
        error: loginGoogleError,
        isLoading: loginGoogleLoading,
        isSuccess: loginGoogleSuccess,
      },
    ] = useLoginGoogleMutation();

  const processingForm = loginLoading || form.processing,
    processing = processingForm || loginGoogleLoading || googleLoading;

  useEffect(() => {
    if (loginSuccess || loginGoogleSuccess)
      (document.querySelector(".exitXl") as HTMLButtonElement).click();
  }, [loginSuccess, loginGoogleSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement,
      fields = form.querySelectorAll<HTMLInputElement>("input");

    try {
      let reqBody: NullablePartial<LoginBodyDto> = {} as any;
      for (const field of fields) {
        if (field.type === "hidden") {
          if (field.value.length) (document.querySelector(".exitXl") as HTMLButtonElement).click();
          continue;
        }
        const key = field.name as keyof LoginBodyDto;

        if (!field.value.length) {
          setError(key, `${capitalize(key)} is required.`);
          continue;
        }
        reqBody[key] = field.value || null;
      }

      if (Object.keys(reqBody).length === 2)
        postLogin(reqBody as LoginBodyDto).then((res) => {
          if (res.data?.message?.endsWith("successfully.")) form.reset();
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate
      aria-description="Login with your Quest Casino profile by providing the details below."
      queryKey={ModalQueryKey.LOGIN_MODAL}
      width="368px"
      className={`modal ${s.modal}`}
      onCloseAutoFocus={() => setErrors({})}
    >
      {() => (
        <>
          <hgroup className="head">
            <Icon aria-hidden="true" id="enter-45" />
            <Title asChild>
              <h2>Login</h2>
            </Title>
          </hgroup>

          <Form
            onSubmit={handleSubmit}
            formLoading={processingForm}
            resError={(loginError || loginGoogleError) as any}
            clearErrors={() => setErrors({})}
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

              <input type="hidden" id="bot" name="bot" />
            </div>
            <Button
              aria-label="Log In"
              aria-live="polite"
              intent="primary"
              size="xl"
              type="submit"
              className="formBtn"
              disabled={processing}
            >
              {processingForm ? (
                <Spinner intent="primary" size="md" />
              ) : (
                "Log In"
              )}
            </Button>
          </Form>

          <LoginWithGoogle
            queryKey={ModalQueryKey.LOGIN_MODAL}
            postLoginGoogle={postLoginGoogle}
            setGoogleLoading={setGoogleLoading}
            processing={{
              google: googleLoading,
              form: processingForm,
              all: processing,
            }}
          />

          <span className={s.haveAcc}>
            Don't have an account?{" "}
            <Link
              intent="primary"
              to={{ search: "?register=true" }}
              onClick={(e) => handleSwitch(e)}
            >
              Register
            </Link>
          </span>
        </>
      )}
    </ModalTemplate>
  );
}

LoginModal.restricted = "loggedIn";
