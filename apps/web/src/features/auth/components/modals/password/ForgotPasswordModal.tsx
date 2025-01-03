import { useFetcher } from "react-router-dom";
import { Title } from "@radix-ui/react-dialog";

import useForm from "@hooks/useForm";
import useSwitchModal from "@authFeat/hooks/useSwitchModal";
import useHandleUserValidationResponse from "@authFeat/hooks/useHandleUserValidationResponse";

import { useSendForgotPasswordEmailMutation } from "@authFeat/services/authApi";

import { ModalTemplate, ModalTrigger } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input } from "@components/common/controls";
import { Spinner } from "@components/loaders";

import s from "./passwordModal.module.css";

export default function ForgotPasswordModal() {
  const fetcher = useFetcher(),
    { formRef, form, setLoading, setError, setErrors } = useForm<{ email: string }>();

  const { handleSwitch } = useSwitchModal("forgot");

  const [
    postSendForgotPasswordEmail,
    {
      data: forgotData,
      error: forgotError,
      isSuccess: forgotSuccess,
      reset: forgotReset
    },
  ] = useSendForgotPasswordEmailMutation();

  useHandleUserValidationResponse(fetcher, { formRef, setLoading, setErrors }, postSendForgotPasswordEmail);

  return (
    <ModalTemplate
      aria-describedby="reTxt"
      queryKey="forgot"
      width="368px"
      className={s.modal}
      onCloseAutoFocus={() => {
        setErrors({});
        forgotReset();
      }}
    >
      {() => (
        <>
          <Title asChild>
            <h2 aria-label="Forgot Password">Forgot</h2>
          </Title>
          <p id="reTxt">Enter your email below and we'll email you a password reset link.</p>

          <Form
            ref={formRef}
            fetcher={fetcher}
            method="post"
            action="/action/user/validate"
            onSubmit={() => {
              setLoading(true);
              if (forgotSuccess) forgotReset();
            }}
            formLoading={form.processing}
            resSuccessMsg={forgotSuccess && forgotData.message}
            resError={forgotError}
            clearErrors={() => setErrors({})}
            noBots
          >
            <div className="inputs">
              <Input
                label="Email"
                intent="primary"
                size="lrg"
                id="email"
                name="email"
                type="email"
                required
                error={form.error.email}
                disabled={form.processing}
                onInput={() => setError("email", "")}
              />
            </div>
            <Button
              aria-label="Submit User Email"
              aria-live="polite"
              intent="primary"
              size="xl"
              type="submit"
              className="formBtn"
              disabled={form.processing}
            >
              {form.processing ? (
                <Spinner intent="primary" size="md" />
              ) : (
                "Submit"
              )}
            </Button>
          </Form>

          <div className={s.back}>
            <ModalTrigger
              query={{ param: "login" }}
              intent="primary"
              onClick={(e) => handleSwitch(e)}
            >
              Back to Login
            </ModalTrigger>
          </div>
        </>
      )}
    </ModalTemplate>
  );
}

ForgotPasswordModal.restricted = "loggedIn";
