// import type CashInBodyDto from "@qc/typescript/dtos/CashInBodyDto";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { Title } from "@radix-ui/react-dialog";

import { capitalize } from "@qc/utils";
import { isFormValidationError } from "@utils/forms";

import useForm from "@hooks/useForm";
// import {
//   useCashInMutation
// } from "@authFeat/services/authApi";

import { ModalTemplate, ModalQueryKey } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input } from "@components/common/controls";
import { Icon, Link } from "@components/common";
import { Spinner } from "@components/loaders";

import s from "./cashInModal.module.css";

// TODO:
export default function CashInModal() {
  //   const { form, setLoading, setError, setErrors } = useForm<CashInBodyDto>();

  //   const processingForm = registerLoading || form.processing,
  //     processing = processingForm || loginGoogleLoading || googleLoading;

  //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     const form = e.target as HTMLFormElement,
  //       field = form.querySelector<HTMLInputElement>("input")!;

  //     try {
  //       let error: string;
  //       const key = field.name as keyof CashInBodyDto;

  //       if (!field.value.length) {
  //         return setError(key, `${capitalize(key)} is required.`);
  //       }

  //       register({ [key]: field.value }).then((res) => {
  //         // prettier-ignore
  //         if (isFormValidationError(res.error))
  //             return setErrors(
  //               ((res.error as FetchBaseQueryError).data?.ERROR as Record<string,string>) || {}
  //             );

  //         if (res.data?.message?.startsWith("Successfully")) form.reset();
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <ModalTemplate
      aria-description="Deposit a amount below by entering the amount or by choosing any of the other third-party services. Keep in mind, that this casino is just for fun, a developer playing around, so no real cash is involved."
      queryKey={ModalQueryKey.CASH_IN_MODAL}
      width="368px"
      className={s.modal}
      //   onEscapeKeyDown={() => setErrors({})}
    >
      {() => (
        <>
          <hgroup className="head">
            <Icon aria-hidden="true" id="hand-cash-48" />
            <Title asChild>
              <h2>Cash In</h2>
            </Title>
          </hgroup>

          <Form
          // formLoading={processing}
          // resSuccessMsg={cashInData.message}
          // resError={cashInError || cashInError}
          // clearErrors={() => setErrors({})}
          // onSubmit={handleSubmit}
          >
            <div className="inputs">
              <Input
                label="Email or Username"
                intent="primary"
                size="lrg"
                id="email_username"
                name="email_username"
                className="formBtn"
                required
                // error={form.error.email_username}
                // disabled={processing}
                // onInput={() => setError("email_username", "")}
              />
            </div>

            <Button
              aria-label="Register"
              aria-live="polite"
              intent="primary"
              size="xl"
              type="submit"
              // disabled={processing}
            >
              {/* {processingForm ? (
                  <Spinner intent="primary" size="md" />
                ) : (
                  "Cash In"
                )} */}
              Cash In
            </Button>
          </Form>

          <div className={s.or}>
            <hr />
            <span
              id="orUse"
              aria-description="Deposit with other third party services."
            >
              Or Use
            </span>
            <hr aria-hidden="true" />
          </div>
          <Button
            aria-label="Paypal"
            aria-describedby="orUse"
            // aria-live="polite"
            intent="secondary"
            size="xl"
            className={s.paypal}
            // disabled={processing}
            onClick={() => alert("")}
          >
            <span>
              <img src="/images/paypal.png" alt="PayPal Logo" loading="lazy" />
              PayPal
            </span>
          </Button>
          <Button
            aria-label="Cash App"
            aria-describedby="orUse"
            // aria-live="polite"
            intent="secondary"
            size="xl"
            className={s.paypal}
            // disabled={processing}
            onClick={() => alert("")}
          >
            <span>
              <img
                src="/images/cash-app.png"
                alt="Cash App Logo"
                loading="lazy"
              />
              PayPal
            </span>
          </Button>

          <span className={s.support}>
            Having Problems?{" "}
            <Link intent="primary" to="/support">
              Contact Support
            </Link>
          </span>
        </>
      )}
    </ModalTemplate>
  );
}
