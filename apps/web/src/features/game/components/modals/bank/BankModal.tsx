import type { TransactionType } from "@qc/constants";

import { useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import { TRANSACTION_TYPES } from "@qc/constants";

import { capitalize } from "@qc/utils";

import useForm from "@hooks/useForm";
import { useTransactionMutation } from "@gameFeat/services/gameApi";

import { ModalTemplate } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input } from "@components/common/controls";
import { Icon, Link } from "@components/common";
import { Spinner } from "@components/loaders";

import s from "./bankModal.module.css";

const MAX_AMOUNT = 1000000;

function formatAmount(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
}

export default function BankModal() {
  const [transactionType, setTransactionType] = useState<TransactionType>("deposit");

  const { form, setLoading, setError, setErrors } = useForm<{ amount: string }>();

  const [
    postTransaction,
    {
      data: transactionData,
      error: transactionError,
      isSuccess: transactionSuccess,
      reset: transactionReset
    },
  ] = useTransactionMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    transactionReset();

    const form = e.currentTarget as HTMLFormElement,
      fields = form.querySelectorAll<HTMLInputElement>("input");

    try {
      let reqBody: { amount: number } = {} as any;
      for (const field of fields) {
        if (field.type === "hidden") {
          if (field.value.length) (document.querySelector(".exitXl") as HTMLButtonElement).click();
          continue;
        }
        const key = field.name as keyof typeof reqBody,
          value = parseInt(field.value);

        if (value < 5) {
          setError("amount", "The minimum amount is $5.");
          return;
        }
        if (value > MAX_AMOUNT) {
          setError("amount", `The maximum amount is $${MAX_AMOUNT.toLocaleString("en-CA")}.`);
          return;
        }

        reqBody[key] = parseFloat(field.value);
      }

      if (reqBody.amount) {
        const res = await postTransaction({ type: transactionType, body: reqBody });
        if (res.data?.message?.startsWith("Successful")) form.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate
      aria-description="Deposit a amount below by entering the amount or by choosing any of the other third-party services. Keep in mind, that this casino is just for fun, a developer playing around, so no real cash is involved."
      queryKey="bank"
      width="368px"
      className={s.modal}
      onCloseAutoFocus={() => {
        setErrors({});
        transactionReset();
      }}
    >
      {() => (
        <>
          <div className={s.tabs}>
            {TRANSACTION_TYPES.map((type) => (
              <Button
                aria-pressed={transactionType === type}
                key={type}
                intent="secondary"
                size="lrg"
                disabled={form.processing}
                onClick={() => setTransactionType(type)}
              >
                {capitalize(type)}
              </Button>
            ))}
          </div>

          <hgroup className="head">
            <Icon aria-hidden="true" id="hand-cash-48" />
            <Title asChild>
              <h2>Cash {transactionType === "deposit" ? "In" : "Out"}</h2>
            </Title>
          </hgroup>

          <Form
            onSubmit={handleSubmit}
            formLoading={form.processing}
            resSuccessMsg={transactionSuccess && transactionData.message}
            resError={transactionError}
            clearErrors={() => setErrors({})}
            noBots
          >
            <div className="inputs">
              <Input
                label="Amount"
                intent="primary"
                size="lrg"
                id="amount"
                name="amount"
                defaultValue={0}
                className="formBtn"
                required
                error={form.error.amount}
                disabled={form.processing}
                onInput={(e) => {
                  formatAmount(e);
                  setError("amount", "");
                }}
              >
                <span aria-hidden="true" className={s.symbol}>$</span>
              </Input>
            </div>

            <Button
              aria-label="Deposit"
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
                "Deposit"
              )}
            </Button>
          </Form>

          <div className={s.or}>
            <span />
            <p
              id="orUse"
              aria-label="Or use other third party services to deposit funds."
            >
              Or Use
            </p>
            <span aria-hidden="true" />
          </div>
          <Button
            aria-describedby="orUse"
            intent="secondary"
            size="xl"
            className={s.paypal}
            disabled={form.processing}
            onClick={() => alert(`This casino is just 'for fun' there is no actual payments processed. Enter a number above to add to your balance.`)}
          >
            <img aria-hidden="true" src="/images/paypal.png" alt="PayPal Logo" loading="lazy" />
            PayPal
          </Button>
          <Button
            aria-label="Cash App"
            aria-describedby="orUse"
            intent="secondary"
            size="xl"
            className={s.paypal}
            disabled={form.processing}
            onClick={() => alert(`This casino is just 'for fun' there is no actual payments processed. Enter a number above to add to your balance.`)}
          >
            <img
              aria-hidden="true"
              src="/images/cash-app.png"
              alt="Cash App Logo"
              loading="lazy"
            />
            PayPal
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

BankModal.restricted = "loggedOut";
