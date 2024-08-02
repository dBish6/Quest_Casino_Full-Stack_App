import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { Country } from "@qc/constants";
import type { Region, Regions } from "@authFeat/typings/Region";

import { useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import formatPhoneNumber from "@authFeat/utils/formatPhoneNumber";
import getSelectedRegion from "@authFeat/utils/getSelectedRegion";
import displayNotificationMessage from "@authFeat/utils/displayNotificationMessage";

import useForm from "@hooks/useForm";
import useSwitchModal from "@authFeat/hooks/useSwitchModal";
import { useRegisterMutation, useLoginGoogleMutation } from "@authFeat/services/authApi";

import { ModalTemplate, ModalQueryKey, ModalTrigger } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input, Select } from "@components/common/controls";
import { Icon, Link } from "@components/common";
import { LoginWithGoogle } from "@authFeat/components/loginWithGoogle";
import { Spinner } from "@components/loaders";

import s from "./registerModal.module.css";

export default function RegisterModal() {
  const fetcher = useFetcher(),
    { formRef, form, setLoading, setError, setErrors } = useForm<
      RegisterBodyDto & { calling_code: string }
    >();

  const { handleSwitch } = useSwitchModal(ModalQueryKey.REGISTER_MODAL);

  const [worldData, setWorldData] = useState<{
      countries: Country[] | null;
      regions: Regions[];
    }>({ countries: null, regions: [] }),
    [selected, setSelected] = useState<{
      country: string;
      regions: Region[] | string;
    }>({ country: "", regions: [] });

  const [
    postRegister,
    {
      data: registerData,
      error: registerError,
      isSuccess: registerSuccess,
      reset: registerReset
    },
  ] = useRegisterMutation();

  const [googleLoading, setGoogleLoading] = useState(false),
    [
      postLoginGoogle,
      {
        data: loginGoogleData,
        error: loginGoogleError,
        isLoading: loginGoogleLoading,
        isSuccess: loginGoogleSuccess,
        reset: loginGoogleReset
      },
    ] = useLoginGoogleMutation();

  const countriesLoading = !!worldData.countries && !worldData.countries.length,
    regionsLoading = !!selected.country && !selected.regions.length;

  const processing = form.processing || loginGoogleLoading || googleLoading;

  const getCountries = async () => {
    if (!worldData.countries?.length) {
      setWorldData((prev) => ({
        ...prev,
        countries: [],
      }));
      const { COUNTRIES } = await import("@qc/constants");
      setWorldData((prev) => ({
        ...prev,
        countries: COUNTRIES,
      }));
    }
  };

  const getRegions = async () => {
    if (!worldData.regions?.length) {
      setWorldData((prev) => ({
        ...prev,
        regions: [],
      }));
      const regionsData = (await import("@authFeat/constants/REGIONS")).default;
      setWorldData((prev) => ({
        ...prev,
        regions: regionsData,
      }));
    }
  };

  useEffect(() => {
    if (selected.country && worldData.regions?.length) {
      setSelected((prev) => ({
        ...prev,
        regions: getSelectedRegion(
          worldData.regions,
          selected.country,
          setError
        ),
      }));
    }
  }, [selected.country, worldData.regions]);

  const handleValidationResponse = async (data: {
    errors: Partial<RegisterBodyDto> & { bot: string };
    reqBody: RegisterBodyDto;
  }) => {
    try {
      if (data.errors) {
        if (data.errors.bot) (document.querySelector(".exitXl") as HTMLButtonElement).click();
        setErrors(data.errors);
      } else {
        await postRegister(data.reqBody).then((res) => {
          if (res.data?.message?.startsWith("Successfully")) formRef.current!.reset();
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (fetcher.data) handleValidationResponse(fetcher.data);
  }, [fetcher.data]);

  return (
    <ModalTemplate
      aria-description="Register a profile at Quest Casino by providing the details below or by pressing the google button."
      queryKey={ModalQueryKey.REGISTER_MODAL}
      width="496px"
      className={s.modal}
      onCloseAutoFocus={() => setErrors({})}
    >
      {() => (
        <>
          <div className="head">
            <hgroup>
              <Icon aria-hidden="true" id="badge-48" />
              <Title asChild>
                <h2>Register</h2>
              </Title>
            </hgroup>
            <div>
              <span>*</span> <span>Required</span>
            </div>
          </div>

          <Form
            ref={formRef}
            fetcher={fetcher}
            method="post"
            action="/action/register"
            onSubmit={() => {
              setLoading(true);
              if (registerSuccess) registerReset();
              if (loginGoogleSuccess) loginGoogleReset();
            }}
            formLoading={processing}
            resSuccessMsg={
              (registerSuccess &&
                displayNotificationMessage(registerData.message, {
                  to: { search: `?${ModalQueryKey.LOGIN_MODAL}=true` },
                  sequence: "log in",
                  queryKey: ModalQueryKey.LOGIN_MODAL,
                  options: { onClick: (e) => handleSwitch(e) }
                })) ||
              (loginGoogleSuccess &&
                `Welcome ${loginGoogleData.user.username}! You're all set, continue to use Google to log in to use your profile. Best of luck and have fun!`)
            }
            resError={(fetcher.data?.ERROR || registerError || loginGoogleError) as any}
            clearErrors={() => setErrors({})}
          >
            <div className="inputs">
              <div role="group">
                <Input
                  label="First Name"
                  intent="primary"
                  size="lrg"
                  id="first_name"
                  name="first_name"
                  required="show"
                  error={form.error.first_name}
                  disabled={processing}
                  onInput={() => setError("first_name", "")}
                />
                <Input
                  label="Last Name"
                  intent="primary"
                  size="lrg"
                  id="last_name"
                  name="last_name"
                  required="show"
                  error={form.error.last_name}
                  disabled={processing}
                  onInput={() => setError("last_name", "")}
                />
              </div>
              <Input
                label="Email"
                intent="primary"
                size="lrg"
                id="email"
                name="email"
                type="email"
                required="show"
                error={form.error.email}
                disabled={processing}
                onInput={() => setError("email", "")}
              />
              <Input
                label="Username"
                intent="primary"
                size="lrg"
                id="username"
                name="username"
                required="show"
                error={form.error.username}
                disabled={processing}
                onInput={() => setError("username", "")}
              />
              <div role="group">
                <Input
                  label="Password"
                  intent="primary"
                  size="lrg"
                  id="password"
                  name="password"
                  type="password"
                  required="show"
                  error={form.error.password}
                  disabled={processing}
                  onInput={() => setError("password", "")}
                />
                <Input
                  label="Confirm Password"
                  intent="primary"
                  size="lrg"
                  id="con_password"
                  name="con_password"
                  type="password"
                  required="show"
                  error={form.error.con_password}
                  disabled={processing}
                  onInput={() => setError("con_password", "")}
                />
              </div>
              <div role="group">
                <Select
                  label="Country"
                  intent="primary"
                  size="lrg"
                  id="country"
                  name="country"
                  required="show"
                  error={form.error.country}
                  Loader={() => <Spinner intent="primary" size="sm" />}
                  loaderTrigger={countriesLoading}
                  disabled={processing}
                  onFocus={() => {
                    getCountries();
                    getRegions();
                  }}
                  onInput={(e) => {
                    setError("country", "");
                    setSelected((prev) => ({
                      ...prev,
                      country: (e.target as HTMLSelectElement).value,
                    }));
                  }}
                >
                  {worldData.countries?.length &&
                    worldData.countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                </Select>
                <Select
                  label="Region"
                  intent="primary"
                  size="lrg"
                  id="region"
                  name="region"
                  error={
                    typeof selected.regions === "string"
                      ? selected.regions
                      : undefined
                  }
                  Loader={() => <Spinner intent="primary" size="sm" />}
                  loaderTrigger={regionsLoading}
                  disabled={!selected.country || processing}
                  onFocus={getRegions}
                >
                  {selected.regions.length &&
                    typeof selected.regions !== "string" &&
                    selected.regions.map((region) => (
                      <option key={region.name} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                </Select>
              </div>

              <div role="group">
                <Select
                  label="Code"
                  intent="callingCode"
                  size="lrg"
                  id="calling_code"
                  name="calling_code"
                  error={form.error.calling_code}
                  Loader={() => <Spinner intent="primary" size="sm" />}
                  loaderTrigger={countriesLoading}
                  disabled={processing}
                  onFocus={getCountries}
                  onInput={() => setError("calling_code", "")}
                >
                  {worldData.countries?.length &&
                    worldData.countries.map((country) => (
                      <option key={country.name} value={country.callingCode}>
                        {country.abbr} {country.callingCode}
                      </option>
                    ))}
                </Select>
                <Input
                  label="Phone Number"
                  intent="primary"
                  size="lrg"
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  error={form.error.phone_number}
                  onInput={(e) => {
                    setError("phone_number", "");
                    formatPhoneNumber(e.target as HTMLInputElement);
                  }}
                  disabled={processing}
                />
              </div>

              <input type="hidden" id="bot" name="bot" />
            </div>

            <div className={s.submit}>
              <Button
                aria-label="Register"
                aria-live="polite"
                intent="primary"
                size="xl"
                type="submit"
                className="formBtn"
                disabled={processing}
              >
                {form.processing ? (
                  <Spinner intent="primary" size="md" />
                ) : (
                  "Register"
                )}
              </Button>
              <p>
                By Registering a profile, you agree to Quest Casino's{" "}
                <Link intent="primary" to="/terms">
                  Terms
                </Link>{" "}
                and{" "}
                <Link intent="primary" to="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </Form>

          <LoginWithGoogle
            queryKey={ModalQueryKey.REGISTER_MODAL}
            postLoginGoogle={postLoginGoogle}
            setGoogleLoading={setGoogleLoading}
            processing={{
              google: googleLoading,
              form: form.processing,
              all: processing,
            }}
          />

          <span className={s.already}>
            Already have a account?{" "}
            <ModalTrigger
              queryKey={ModalQueryKey.LOGIN_MODAL}
              intent="primary"
              onClick={(e) => handleSwitch(e)}
            >
              Login
            </ModalTrigger>
          </span>
        </>
      )}
    </ModalTemplate>
  );
}

RegisterModal.restricted = "loggedIn";
