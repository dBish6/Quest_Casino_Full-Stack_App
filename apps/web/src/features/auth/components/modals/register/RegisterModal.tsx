import type {
  RegisterBodyDto,
  RegisterGoogleBodyDto,
} from "@qc/typescript/dtos/RegisterBodyDto";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type Country from "@authFeat/typings/Country";
import type { Region, Regions } from "@authFeat/typings/Region";
import type NullablePartial from "@qc/typescript/typings/NullablePartial";

import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Content, Title } from "@radix-ui/react-dialog";

import formatPhoneNumber from "@authFeat/utils/formatPhoneNumber";
import getSelectedRegion from "@authFeat/utils/getSelectedRegion";
import { isFormValidationError } from "@utils/forms";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";
import { history } from "@utils/History";

import { useAppSelector } from "@redux/hooks";
import { selectUserOStateToken } from "@authFeat/redux/authSelectors";

import useForm from "@hooks/useForm";
import {
  useRegisterMutation,
  useRegisterGoogleMutation,
} from "@authFeat/services/authApi";

import ModalTemplate from "@components/modals/ModalTemplate";
import { ScrollArea } from "@components/scrollArea";
import { Form } from "@components/form";
import { Button, Input, Select } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Link } from "@components/common/link";
import { Spinner } from "@components/loaders";

import s from "./registerModal.module.css";

interface GoogleCallbackProps {
  searchParams: URLSearchParams;
  storedOState: string;
  redirectUri: string;
}

const QUERY = "register";

export default function RegisterModal() {
  const [searchParams] = useSearchParams(),
    location = useLocation();

  const storedOState = useAppSelector(selectUserOStateToken), // The initial oState token for the google register for verification.
    redirectUri = `${import.meta.env.VITE_APP_URL}/about?register=google`;

  const { form, setLoading, setError, setErrors, clearError } =
    useForm<RegisterBodyDto>();

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

  const countriesLoading = !!worldData.countries && !worldData.countries.length,
    regionsLoading = !!selected.country && !selected.regions.length;

  const processingForm = registerLoading || form.processing;

  const createGoogleOAuthUrl = () => {
    const redirectUri = `${import.meta.env.VITE_APP_URL}/about?register=google`,
      scope = "email profile",
      state = storedOState;

    return `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fields = (e.target as HTMLFormElement).querySelectorAll<
      HTMLInputElement | HTMLSelectElement
    >("input, select");

    let reqBody: NullablePartial<RegisterBodyDto> = {} as any;
    for (const field of fields) {
      reqBody[field.name as keyof RegisterBodyDto] = field.value || null;
    }

    register(reqBody as RegisterBodyDto)
      .then((res) => {
        // prettier-ignore
        if (isFormValidationError(res.error)) 
        setErrors(
          ((res.error as FetchBaseQueryError).data?.ERROR as Record<string, string>) || {}
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <ModalTemplate query={QUERY} btnText="Register">
      {({ close, contentProps }) => (
        <Content
          aria-description="Register a profile at Quest Casino by providing the details below or by pressing the google button."
          {...contentProps}
        >
          <ScrollArea className={s.modal} orientation="vertical">
            <Button
              intent="exit"
              size="xl"
              className={s.exit}
              onClick={close}
            />

            <div className={s.head}>
              <hgroup>
                <Icon id="badge-48" />
                <Title asChild>
                  <h2>Register</h2>
                </Title>
              </hgroup>
              <div>
                <span>*</span> <span>Required</span>
              </div>
            </div>

            {!searchParams.has(QUERY, "google") ? (
              <>
                <Form
                  formLoading={processingForm}
                  resSuccessMsg={successMessage(registerSuccess, registerData)}
                  resError={registerError}
                  onSubmit={handleSubmit}
                >
                  <div className={s.inputs}>
                    <div role="group">
                      <Input
                        label="First Name"
                        intent="primary"
                        size="lrg"
                        id="first_name"
                        name="first_name"
                        required
                        error={form.error.first_name}
                        disabled={processingForm}
                        onInput={() => clearError("first_name")}
                      />
                      <Input
                        label="Last Name"
                        intent="primary"
                        size="lrg"
                        id="last_name"
                        name="last_name"
                        required
                        error={form.error.last_name}
                        disabled={processingForm}
                        onInput={() => clearError("last_name")}
                      />
                    </div>
                    <Input
                      label="Email"
                      intent="primary"
                      size="lrg"
                      id="email"
                      name="email"
                      type="email"
                      required
                      error={form.error.email}
                      disabled={processingForm}
                      onInput={() => clearError("email")}
                    />
                    <Input
                      label="Username"
                      intent="primary"
                      size="lrg"
                      id="username"
                      name="username"
                      required
                      error={form.error.username}
                      disabled={processingForm}
                      onInput={() => clearError("username")}
                    />
                    <div role="group">
                      <Input
                        label="Password"
                        intent="primary"
                        size="lrg"
                        id="password"
                        name="password"
                        type="password"
                        required
                        error={form.error.password}
                        disabled={processingForm}
                        onInput={() => clearError("password")}
                      />
                      <Input
                        label="Confirm Password"
                        intent="primary"
                        size="lrg"
                        id="con_password"
                        name="con_password"
                        type="password"
                        required
                        error={form.error.con_password}
                        disabled={processingForm}
                        onInput={() => clearError("con_password")}
                      />
                    </div>
                    <div role="group">
                      <Select
                        label="Country"
                        intent="primary"
                        size="lrg"
                        id="country"
                        name="country"
                        required
                        error={form.error.country}
                        Loader={() => <Spinner intent="primary" size="sm" />}
                        loaderTrigger={countriesLoading}
                        disabled={processingForm}
                        onFocus={() => {
                          getCountries();
                          getRegions();
                        }}
                        onInput={(e) => {
                          clearError("country");
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
                        disabled={!selected.country || processingForm}
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
                        disabled={processingForm}
                        onFocus={getCountries}
                        onInput={() => clearError("calling_code")}
                      >
                        {worldData.countries?.length &&
                          worldData.countries.map((country) => (
                            <option
                              key={country.name}
                              value={country.callingCode}
                            >
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
                          clearError("phone_number");
                          formatPhoneNumber(e.target as HTMLInputElement);
                        }}
                        disabled={processingForm}
                      />
                    </div>
                  </div>

                  <Submit processingForm={processingForm} />
                </Form>

                <div className={s.or}>
                  <hr />
                  <span
                    id="logWit"
                    aria-description="Log in with other third party services."
                  >
                    Or Login With
                  </span>
                  <hr aria-hidden="true" />
                </div>
                <Button
                  aria-describedby="logWit"
                  intent="secondary"
                  size="xl"
                  className={s.google}
                  disabled={processingForm}
                  onClick={() =>
                    window.open(
                      createGoogleOAuthUrl(),
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <span>
                    <Icon id="google-24" />
                    Google
                  </span>
                </Button>
              </>
            ) : (
              //  Prompts the user to set a password, so they can log in with email. This causes the back-end to skip a step when email is the main login.
              <GoogleCallback
                searchParams={searchParams}
                storedOState={storedOState || ""}
                redirectUri={redirectUri}
              />
            )}

            <span className={s.already}>
              Already have a account?{" "}
              <Link intent="primary" to={`${location.pathname}?login=true`}>
                Log In
              </Link>
            </span>
          </ScrollArea>
        </Content>
      )}
    </ModalTemplate>
  );
}

/**
 * Handles the new form when a user is redirected back by a register with google button.
 */
function GoogleCallback({
  searchParams,
  storedOState,
  redirectUri,
}: GoogleCallbackProps) {
  const { form, setLoading, setErrors, clearError } = useForm<{
    password: string;
    con_password: string;
  }>();

  const [
    registerGoogle,
    {
      data: registerGoogleData,
      error: registerGoogleError,
      isLoading: registerGoogleLoading,
      isSuccess: registerGoogleSuccess,
    },
  ] = useRegisterGoogleMutation();

  const processingForm = registerGoogleLoading || form.processing;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fields = (
      e.target as HTMLFormElement
    ).querySelectorAll<HTMLInputElement>("input");

    let reqBody: NullablePartial<RegisterGoogleBodyDto> = {} as any;
    for (const field of fields) {
      reqBody[field.name as keyof RegisterGoogleBodyDto] = field.value || null;
    }
    reqBody = {
      ...reqBody,
      code: searchParams.get("code") || "",
      state: searchParams.get("state") || "",
      stored_state: storedOState,
      redirect_uri: redirectUri,
    };

    registerGoogle(reqBody)
      .then((res) => {
        // prettier-ignore
        if (isFetchBaseQueryError(res.error)) {
          [401, 403].includes(res.error.status)
            ? history.push(`/error-${res.error.status.toString()}`) // TODO: Probably don't need this with apiErrorHandler.
            : setErrors(
                ((res.error as FetchBaseQueryError).data?.ERROR as Record<string,string>) || {}
              );
        }
      })
      .finally(() => setLoading(false));
    setLoading(false);
  };

  return (
    <Form
      formLoading={processingForm}
      resSuccessMsg={successMessage(registerGoogleSuccess, registerGoogleData)}
      resError={registerGoogleError}
      onSubmit={handleSubmit}
    >
      <div className={s.inputs}>
        <Input
          label="Password"
          intent="primary"
          size="lrg"
          id="password"
          name="password"
          type="password"
          required
          error={form.error.password}
          disabled={processingForm}
          onInput={() => clearError("password")}
        />
        <Input
          label="Confirm Password"
          intent="primary"
          size="lrg"
          id="con_password"
          name="con_password"
          type="password"
          required
          error={form.error.con_password}
          disabled={processingForm}
          onInput={() => clearError("con_password")}
        />
      </div>

      <Submit processingForm={processingForm} />
    </Form>
  );
}

function Submit({ processingForm }: { processingForm: boolean }) {
  return (
    <div className={s.submit}>
      <Button
        aria-live="polite"
        intent="primary"
        size="xl"
        type="submit"
        disabled={processingForm}
      >
        {processingForm ? <Spinner intent="primary" size="md" /> : "Register"}
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
  );
}

function successMessage(resSuccess: boolean, data: any) {
  if (resSuccess) {
    const parts = data?.message.split("log in");

    return (
      parts &&
      (parts[1] ? (
        <>
          {parts[0]}
          <Link intent="primary" to={`${location.pathname}?login=true`}>
            log in
          </Link>
          {parts[1]}
        </>
      ) : (
        data?.message
      ))
    );
  }
}
