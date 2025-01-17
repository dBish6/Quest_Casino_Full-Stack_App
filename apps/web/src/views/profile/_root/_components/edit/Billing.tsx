/**
 * Note: 
 * Quest Casino is just for fun and doesn't gamble real money, so this section just has
 * non-functioning payment methods. But in the future I will add a way to donate here somehow
 * for some indiction that people would actually like to see this become a real online gambling
 * site. Although, I would need a lot of money for it and would be imposable to do it myself.
 */

import type { UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";
import type DeepReadonly from "@qc/typescript/typings/DeepReadonly";

import { useState, useEffect } from "react";

import CURRENT_YEAR from "@constants/CURRENT_YEAR";

import getStorageKey from "@utils/getStorageKey";
import { capitalize } from "@qc/utils";

import useForm from "@hooks/useForm";

import { Icon, Link, Image } from "@components/common";
import { Button, Input, Select } from "@components/common/controls";
import { Form } from "@components/form";
import { ModalTrigger } from "@components/modals";
import { ScrollArea } from "@components/scrollArea";

import s from "../../profile.module.css";
import { Spinner } from "@components/loaders";

interface PaymentCard {
  title: string;
  type: "Debit" | "Credit";
  branch: "mastercard" | "visa";
  name: string;
  number: string;
  expiry: string;
  CVV: string;
  def: boolean;
}

interface PaymentState {
  cards: { [title: string]: PaymentCard; };
  thirdParty: { paypal: boolean; cashApp: boolean }
}

interface SelectedState {
  edit: { [title: string]: boolean; };
}

interface PaymentCardProps {
  user: UserProfileCredentials;
  card: Partial<PaymentCard>;
  setPayments: React.Dispatch<React.SetStateAction<PaymentState>>;
  selected: SelectedState;
  setSelected: React.Dispatch<React.SetStateAction<SelectedState>>
}

interface PaymentThirdPartyConnectProps {
  user: UserProfileCredentials;
  party: typeof THIRD_PARTIES[number];
  connected: boolean;
  setPayments: React.Dispatch<React.SetStateAction<PaymentState>>;
}

interface ProfileBillingProps {
  user: UserProfileCredentials;
}

const THIRD_PARTIES = ["PayPal", "Cash App"] as const;

const formatCard = {
  number: (num: string) => {
    const parts = num.split(" ");
    for (let i = 0; i < parts.length - 1; i++) {
      parts[i] = "xxxx";
    }
    return parts.join(" ");
  },
  form: {
    number: (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget.value.replace(/\D/g, "").slice(0, 16);
      e.currentTarget.value = input.replace(/(.{4})/g, "$1 ").trim();
    },
    expiry: (e: React.FormEvent<HTMLInputElement>) => {
      let input = e.currentTarget.value.replace(/\D/g, "");
      if (input.length >= 3) input = `${input.slice(0, 2)}/${input.slice(2, 6)}`;
      e.currentTarget.value = input.slice(0, 7);
    },
    CVV: (e: React.FormEvent<HTMLInputElement>) => {
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 3);
    },
    branch: (num: string) => {
      // Visa (starts with 4).
      if (num[0] === "4") {
        return "visa";
      }
      const firstTwoDigits = parseInt(num.slice(0, 2));
      // Mastercard (starts with 51-55 or 22-27).
      if ((firstTwoDigits >= 51 && firstTwoDigits <= 55) || (firstTwoDigits >= 22 && firstTwoDigits <= 27)) {
        return "mastercard";
      }
  
      return null;
    },
  }
};

const defaultPaymentsState = (user: UserProfileCredentials): DeepReadonly<PaymentState> => ({
  cards: {
    "Card 1": {
      title: "Card 1",
      type: "Debit",
      branch: "mastercard",
      name: `${user.legal_name?.first} ${user.legal_name?.last}`,
      number: "0784 0784 0784 0784",
      expiry: `04/${parseInt(CURRENT_YEAR) + 1}`,
      CVV: "784",
      def: false
    }
  },
  thirdParty: { paypal: false, cashApp: false }
});

function toCamelCase(txt: string) {
  return txt.split(" ").map((parts, i) => (i === 0 ? parts.toLowerCase() : parts)).join("");
}

export default function Billing({ user }: ProfileBillingProps) {
  const [payments, setPayments] = useState<PaymentState>(() => {
      const init = JSON.parse(localStorage.getItem(getStorageKey(user.member_id, "pay-cards")) || "{}");

      return {
        cards: {
          ...(!Object.values(init.cards || {}).length && defaultPaymentsState(user).cards)
        },
        thirdParty: {
          ...(!Object.values(init.thirdParty || {}).length && defaultPaymentsState(user).thirdParty)
        },
        ...init
      };
    }),
    [selected, setSelected] = useState<SelectedState>({ edit: {} });

  return (
    <section className={s.billing}>
      <header>
        <hgroup className={s.title}>
          <Icon aria-hidden="true" id="debit-card-38" scaleWithText />
          <h2 id="hPersonal">Billing</h2>
        </hgroup>
        <ModalTrigger 
          query={{ param: "phist" }}
          intent="primary"
        >
          View Payment History
        </ModalTrigger>
      </header>

      <ul className={s.cards}>
        {[...Object.values(payments.cards), { title: `Card ${Object.values(payments.cards).length + 1}` }].map((card: any, i) => (
          <PaymentCard key={card?.title || i} user={user} card={card} setPayments={setPayments} selected={selected} setSelected={setSelected} />
        ))}
      </ul>

      <div className={s.thirdParties}>
        {THIRD_PARTIES.map((party, i) => (
          <PaymentThirdPartyConnect
            key={i}
            user={user}
            party={party}
            connected={payments.thirdParty[toCamelCase(party) as keyof typeof payments.thirdParty]}
            setPayments={setPayments}
          />
        ))}
      </div>
    </section>
  );
}

function PaymentCard({ card, ...props }: PaymentCardProps) {
  return (
    <li className={s.paymentCard}>
      {!card.name ? (
        !props.selected.edit[card.title!] ? (
          <Button
            aria-labelledby="cAddTxt"
            aria-description="Create a new payment card for your profile."
            onClick={() =>
              props.setSelected((prev) => ({
                ...prev,
                edit: { [card.title!]: true }
              }))
            }
          >
            <div>
              <div role="presentation">
                <Icon id="add-15" />
              </div>
              <p id="cAddTxt">Add New Card</p>
            </div>
          </Button>
        ) : (
          <PaymentCardFull card={card} {...props} />
        )
      ) : (
        <PaymentCardFull card={card} {...props} />
      )}
    </li>
  );
}

function PaymentCardFull({ user, card, setPayments, selected, setSelected }: PaymentCardProps) {
  const isEditing = selected?.edit[card.title!];

  const { form, setLoading, setError } = useForm<Record<string, string>>(),
    [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("global", "");
    setSuccess("");

    const billForm = e.currentTarget as HTMLFormElement,
      fields = billForm.querySelectorAll<HTMLInputElement>("input, select");

    try {
      let newCard: Record<string, any> = {};
      for (const field of fields) {
        const key = field.name;
        let value = field.value;

        if (!field.value.length) {
          setError(key, `${key === "cvv" ? "CVV" : capitalize(key)} is required.`);
          continue;
        }

        if (key === "number" && value.length !== 19) {
          setError("number", "Card number must be 16 digits.")
          continue;
        }
        if (key === "expiry") {
          const [month, year] = value.split("/").map((val) => parseInt(val)),
            currentDate = new Date(),
            currentMonth = currentDate.getMonth() + 1,
            currentYear = currentDate.getFullYear();

          if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
            setError("expiry", "Invalid month. Must be between 01 and 12.");
            continue;
          }

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setError("expiry", "Card expiry date must be in the future.");
            continue;
          }
        }
        if (key === "cvv") {
          if (value.length !== 3) setError("cvv", "CVV must be 3 digits.");
          else newCard.CVV = value;
          continue;
        }

        newCard[key] = value;
      }
      const branch = formatCard.form.branch(newCard.number);
      if (branch === null)
        return setError(
          "global",
          "We're sorry, but your card type is not supported. Currently, we only accept Mastercard or Visa."
        );
      
      newCard.branch = branch;

      (newCard as any).name = `${newCard.first_name} ${newCard.last_name}`;
      ["first_name", "last_name"].forEach((key) => {
        delete newCard[key];
      });

      newCard.def = card.def!;

      if (Object.keys(newCard).length === 8) {
        setPayments((prev) => {
          const newState = {
            ...prev,
            cards: { ...prev.cards, [card.title!]: { ...prev.cards[card.title!], ...newCard } }
          };

          if (Object.values(newState.cards).length >= 4) {
            setError(
              "global",
              "You've reached the maximum limit of 4 payment cards. Please remove an existing card to add a new one."
            );
            return prev;
          }

          localStorage.setItem(getStorageKey(user!.member_id, "pay-cards"), JSON.stringify(newState));
          setSuccess("Payments successfully updated.");

          return newState;
        });
      } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <article data-editing={!!isEditing}>
        {!isEditing ? (
          <>
            <header>
              <hgroup
                {...(!isEditing && {
                  role: "group",
                  "aria-roledescription": "heading group",
                })}
              >
                <h3>{card.title}</h3>
                <p aria-roledescription="subtitle">{card.type} Card</p>
              </hgroup>
              <Button
                aria-label={`Edit ${card.title}`}
                intent="primary"
                size="md"
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    edit: { [card.title!]: true }
                  }))
                }
              >
                <Icon aria-hidden="true" id="edit-14" /> Edit
              </Button>
            </header>

            <div className={s.content}>
              <div className={s.imgContainer}>
                <Image
                  src={`/images/${card.branch}.webp`}
                  alt={`${card.branch} Logo`}
                />
              </div>
              <div className={s.info}>
                <div>
                  <p>{card.name}</p>
                  <span aria-label="Card Number">
                    {formatCard.number(card.number!)}
                  </span>
                  <time aria-label="Card Expiry" dateTime={card.expiry}>
                    {card.expiry}
                  </time>
                </div>

                <Link asChild intent="primary" to="">
                  <Button
                    onClick={() =>
                      setPayments((prev) => {
                        const newState = {
                          ...prev,
                          cards: { ...prev.cards, [card.title!]: { ...prev.cards[card.title!], def: true } }
                        };
                        localStorage.setItem(getStorageKey(user!.member_id, "pay-cards"), JSON.stringify(newState));
                        return newState;
                      })
                    }
                  >
                    {card.def ? "Unset Default" : "Set as Default"}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <ScrollArea orientation="vertical">
            <div>
              <Button
                aria-label="Exit Edit"
                intent="exit ghost"
                size="md"
                onClick={() => 
                  setSelected((prev) => ({
                    ...prev,
                    edit: { [card.title!]: false }
                  }))
                }
              />
              <Button
                aria-label="Delete Card"
                intent="ghost"
                size="md"
                iconBtn
                onClick={() => {
                  setPayments((prev) => {
                    const newState = { ...prev };
                    delete newState.cards[card.title!];
                    localStorage.setItem(getStorageKey(user!.member_id, "pay-cards"), JSON.stringify(prev));
                    return prev;
                  });
                  setSelected((prev) => ({
                    ...prev,
                    edit: { [card.title!]: false }
                  }));
                }}
              >
                <Icon id="delete-15" />
              </Button>
            </div>
            <Form
              onSubmit={handleSubmit}
              formLoading={form.processing}
              resSuccessMsg={success}
              resError={form.error.global}
            >
              <div role="presentation" className={s.inline}>
                <Input
                  label="Title"
                  intent="primary"
                  size="md"
                  id="title"
                  name="title"
                  defaultValue={card.title}
                  error={form.error.title}
                  disabled={form.processing}
                  onInput={() => setError("title", "")}
                />
                <Select
                  label="Type"
                  intent="primary"
                  size="md"
                  id="type"
                  name="type"
                  defaultValue={card.type}
                  error={form.error.type}
                  disabled={form.processing}
                  onInput={() => setError("type", "")}
                >
                  <option value="Debit">
                    Debit
                  </option>
                  <option value="Credit">
                    Credit
                  </option>
                </Select>
              </div>
              <div role="group" className={s.inline}>
                <Input
                  label="First Name"
                  intent="primary"
                  size="md"
                  id="first_name"
                  name="first_name"
                  defaultValue={card.name?.split(" ")[0]}
                  error={form.error.first_name}
                  disabled={form.processing}
                  onInput={() => setError("first_name", "")}
                />
                <Input
                  label="Last Name"
                  intent="primary"
                  size="md"
                  id="last_name"
                  name="last_name"
                  defaultValue={card.name?.split(" ")[1]}
                  error={form.error.last_name}
                  disabled={form.processing}
                  onInput={() => setError("last_name", "")}
                />
              </div>
              <Input
                label="Number"
                intent="primary"
                size="md"
                id="number"
                name="number"
                defaultValue={card.number}
                error={form.error.number}
                disabled={form.processing}
                onInput={(e) => {
                  setError("number", "");
                  formatCard.form.number(e);
                }}
              />
              <div role="presentation" className={s.inline}>
                <Input
                  label="Expiry"
                  intent="primary"
                  size="md"
                  id="expiry"
                  name="expiry"
                  defaultValue={card.expiry}
                  error={form.error.expiry}
                  disabled={form.processing}
                  onInput={(e) => {
                    setError("expiry", "");
                    formatCard.form.expiry(e);
                  }}
                />
                <Input
                  label="CVV"
                  intent="primary"
                  size="md"
                  id="cvv"
                  name="cvv"
                  type="password"
                  defaultValue={card.CVV}
                  Button="password"
                  error={form.error.cvv}
                  disabled={form.processing}
                  onInput={(e) => {
                    setError("cvv", "");
                    formatCard.form.CVV(e);
                  }}
                />
              </div>
              <Button
                aria-label="Update"
                aria-live="polite"
                intent="primary"
                size="md"
                type="submit"
                disabled={form.processing}
              >
                {form.processing ? (
                  <Spinner intent="primary" size="sm" />
                ) : (
                  "Update"
                )}
              </Button>
            </Form>
            <p className={s.disc}>You don't need to enter your real card information, this is just for fun.</p>
          </ScrollArea>
        )}
      </article>
    </>
  );
}

function PaymentThirdPartyConnect({ user, party, connected, setPayments }: PaymentThirdPartyConnectProps) {
  return (
    <Button 
      intent="secondary" 
      size="xl"
      onClick={() =>
        setPayments((prev) => {
          const newState = {
            ...prev,
            thirdParty: { ...prev.thirdParty, [toCamelCase(party)]: !connected }
          };
          localStorage.setItem(getStorageKey(user!.member_id, "pay-cards"), JSON.stringify(newState));
          return newState;
        })
      }
    >
      <Image
        aria-hidden="true"
        src={`/images/${party.replace(" ", "-").toLowerCase()}.png`}
        alt={`${party} Logo`}
        load={false}
      />
      {connected ? (
        <>
          {party} Connected
          <Icon id="check-mark-18" fill="var(--c-status-green)" />
        </>
      ) : (
        <>Connect {party}</>
      )}
    </Button>
  );
}