import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SuccessResponse } from "@typings/ApiResponse";
import type Country from "@authFeat/typings/Country";
import type { Region, Regions } from "@authFeat/typings/Region";
import type NullablePartial from "@qc/typescript/typings/NullablePartial";

import { useEffect, useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import formatPhoneNumber from "@authFeat/utils/formatPhoneNumber";
import getSelectedRegion from "@authFeat/utils/getSelectedRegion";
import { capitalize } from "@qc/utils";
import { isFormValidationError } from "@utils/forms";

import useForm from "@hooks/useForm";
import useSwitchModal from "@authFeat/hooks/useSwitchModal";
import {
  useRegisterMutation,
  useLoginGoogleMutation,
} from "@authFeat/services/authApi";

import { ModalTemplate } from "@components/modals";
import { Form } from "@components/form";
import { Button, Input, Select } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Link } from "@components/common/link";
import { LoginWithGoogle } from "@authFeat/components/loginWithGoogle";
import { Spinner } from "@components/loaders";

import s from "./registerModal.module.css";

export default function RegisterModal() {
  const { form, setLoading, setError, setErrors } = useForm<RegisterBodyDto>();
  const { handleSwitch } = useSwitchModal("register");

  const [worldData, setWorldData] = useState<{
      countries: Country[] | null;
      regions: Regions[];
    }>({ countries: null, regions: [] }),
    [selected, setSelected] = useState<{
      country: string;
      regions: Region[] | string;
    }>({ country: "", regions: [] });

  const [
    register,
    {
      data: registerData,
      error: registerError,
      isLoading: registerLoading,
      isSuccess: registerSuccess,
    },
  ] = useRegisterMutation();

  const [googleLoading, setGoogleLoading] = useState(false),
    [
      loginGoogle,
      {
        data: loginGoogleData,
        error: loginGoogleError,
        isLoading: loginGoogleLoading,
        isSuccess: loginGoogleSuccess,
      },
    ] = useLoginGoogleMutation();

  const countriesLoading = !!worldData.countries && !worldData.countries.length,
    regionsLoading = !!selected.country && !selected.regions.length;

  const processingForm = registerLoading || form.processing,
    processing = processingForm || loginGoogleLoading || googleLoading;

  const getCountries = async () => {
    if (!worldData.countries?.length) {
      setWorldData((prev) => ({
        ...prev,
        countries: [],
      }));
      const countriesData = (await import("@authFeat/constants/COUNTRIES"))
        .default;
      setWorldData((prev) => ({
        ...prev,
        countries: countriesData,
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

  const optionalFields = new Set([
    "country",
    "region",
    "calling_code",
    "phone_number",
  ]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement,
      fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        "input, select"
      );

    try {
      let errors: Partial<RegisterBodyDto> = {},
        reqBody: NullablePartial<RegisterBodyDto> = {} as any;
      for (const field of fields) {
        const key = field.name as keyof RegisterBodyDto;

        if (!field.value.length && !optionalFields.has(key)) {
          errors[key] =
            key === "con_password"
              ? "Please confirm your password."
              : `${capitalize(key)} is required.`;
          continue;
        }
        reqBody[key] = field.value || null;
      }

      if (Object.keys(errors).length) {
        setErrors(errors);
      } else {
        register(reqBody as RegisterBodyDto).then((res) => {
          // prettier-ignore
          if (isFormValidationError(res.error))
            return setErrors(
              ((res.error as FetchBaseQueryError).data?.ERROR as Record<string,string>) || {}
            );

          if (res.data?.message?.startsWith("Successfully")) form.reset();
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const successMessage = (resSuccess: boolean, data: any) => {
    if (resSuccess) {
      const parts = data?.message.split("log in");

      return (
        parts &&
        (parts[1] ? (
          <>
            {parts[0]}
            <Link intent="primary" to={{ search: "?login=true" }}>
              log in
            </Link>
            {parts[1]}
          </>
        ) : (
          data?.message
        ))
      );
    }
  };

  return (
    <ModalTemplate
      aria-description="Register a profile at Quest Casino by providing the details below or by pressing the google button."
      queryKey="register"
      width="496px"
      className={s.modal}
      onCloseAutoFocus={() => setErrors({})}
      Trigger={null}
    >
      {({ close }) => (
        <>
          <Button
            intent="exit"
            size="xl"
            className="exitXl"
            onClick={() => close()}
          />

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
            formLoading={processing}
            resSuccessMsg={
              successMessage(registerSuccess, registerData) ||
              (loginGoogleSuccess &&
                `Welcome ${(loginGoogleData as SuccessResponse).user.username}! You're all set, continue to use Google to log in to use your profile. Best of luck and have fun!`)
            }
            resError={registerError || loginGoogleError}
            clearErrors={() => setErrors({})}
            onSubmit={handleSubmit}
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
                  // FIXME:
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
            </div>

            <div className={s.submit}>
              <Button
                aria-label="Register"
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
            queryKey="register"
            loginGoogle={loginGoogle}
            setGoogleLoading={setGoogleLoading}
            processing={{
              google: googleLoading,
              form: processingForm,
              all: processing,
            }}
          />

          <span className={s.already}>
            Already have a account?{" "}
            <Link
              intent="primary"
              to={{ search: "?login1=true" }}
              onClick={(e) => handleSwitch(e)}
            >
              Log In
            </Link>
          </span>
        </>
      )}
    </ModalTemplate>
  );
}
