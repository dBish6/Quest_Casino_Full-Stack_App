import type Country from "@authFeat/typings/Country";
import type { Region, Regions } from "@authFeat/typings/Region";

import { useFetcher, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Content, Title } from "@radix-ui/react-dialog";

import formatPhoneNumber from "@authFeat/utils/formatPhoneNumber";
import getSelectedRegion from "@authFeat/utils/getSelectedRegion";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { useRegisterMutation } from "@authFeat/services/authApi";

import ModalTemplate from "@components/modals/ModalTemplate";
import { ScrollArea } from "@components/scrollArea";
import { Button, Input, Select } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Link } from "@components/common/link";
import { Spinner } from "@components/loaders";

import s from "./registerModal.module.css";

export default function RegisterModal() {
  const fetcher = useFetcher(),
    location = useLocation();

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
    { data: registerData, error, isLoading: registerLoading, isSuccess },
  ] = useRegisterMutation();

  const countriesLoading = !!worldData.countries && !worldData.countries.length,
    regionsLoading = !!selected.country && !selected.regions.length;

  const processingForm = registerLoading || fetcher.state === "loading";

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
        regions: getSelectedRegion(worldData.regions, selected.country),
      }));
    }
  }, [selected.country, worldData.regions]);

  useEffect(() => {
    (async () => {
      if (!fetcher.data?.errors) await register(fetcher.data.user);
    })();
  }, [fetcher.data]);

  const successMessage = () => {
    const parts = registerData?.message.split("log in");

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
        registerData?.message
      ))
    );
  };

  return (
    <ModalTemplate query="register" btnText="Register">
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

            {fetcher.state !== "submitting" &&
              (isSuccess ? (
                <span className={s.message}>{successMessage()}</span>
              ) : (
                error && (
                  <span role="alert" id="globalFormError">
                    {isFetchBaseQueryError(error) ? (
                      error.status === 400 ? (
                        error.data?.message
                      ) : (
                        <>
                          An unexpected server error occurred. Please try
                          refreshing the page. If the error persists, feel free
                          to reach out to{" "}
                          <Link intent="primary" to="/support">
                            support
                          </Link>
                          .
                        </>
                      )
                    ) : (
                      <>
                        {error.message} If the error persists, feel free to
                        reach out to{" "}
                        <Link intent="primary" to="/support">
                          support
                        </Link>
                        .
                      </>
                    )}
                  </span>
                )
              ))}
            <fetcher.Form
              aria-errormessage="globalFormError"
              method="post"
              action="/action/register"
              autoComplete="off"
              noValidate
            >
              <div className={s.inputs}>
                <div role="group">
                  <Input
                    label="First Name"
                    intent="primary"
                    size="lrg"
                    id="firstName"
                    name="firstName"
                    required
                    error={fetcher.data?.errors?.firstName}
                    disabled={processingForm}
                  />
                  <Input
                    label="Last Name"
                    intent="primary"
                    size="lrg"
                    id="lastName"
                    name="lastName"
                    required
                    error={fetcher.data?.errors?.lastName}
                    disabled={processingForm}
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
                  error={fetcher.data?.errors?.email}
                  disabled={processingForm}
                />
                <Input
                  label="Username"
                  intent="primary"
                  size="lrg"
                  id="username"
                  name="username"
                  required
                  error={fetcher.data?.errors?.username}
                  disabled={processingForm}
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
                    error={fetcher.data?.errors?.password}
                    disabled={processingForm}
                  />
                  <Input
                    label="Confirm Password"
                    intent="primary"
                    size="lrg"
                    id="conPassword"
                    name="conPassword"
                    type="password"
                    required
                    error={fetcher.data?.errors?.conPassword}
                    disabled={processingForm}
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
                    error={fetcher.data?.errors?.country}
                    Loader={() => <Spinner intent="primary" size="sm" />}
                    loaderTrigger={countriesLoading}
                    disabled={processingForm}
                    onFocus={() => {
                      getCountries();
                      getRegions();
                    }}
                    onInput={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        country: (e.target as HTMLSelectElement).value,
                      }))
                    }
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
                    id="callingCode"
                    name="callingCode"
                    error={fetcher.data?.errors?.callingCode}
                    // FIXME:
                    Loader={() => <Spinner intent="primary" size="sm" />}
                    loaderTrigger={countriesLoading}
                    disabled={processingForm}
                    onFocus={getCountries}
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
                    error={fetcher.data?.errors?.phoneNumber}
                    onInput={(e) =>
                      formatPhoneNumber(e.target as HTMLInputElement)
                    }
                    disabled={processingForm}
                  />
                </div>
              </div>

              <div className={s.submit}>
                <Button
                  aria-live="polite"
                  intent="primary"
                  size="xl"
                  disabled={processingForm}
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
            </fetcher.Form>

            <div className={s.or}>
              <hr />
              <span id="logWit" aria-details="" aria-description="">
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
            >
              <span>
                <Icon id="google-24" />
                Google
              </span>
            </Button>

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
