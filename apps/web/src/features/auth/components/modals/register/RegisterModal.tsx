import type Country from "@authFeat/typings/Country";
import type { Region, Regions } from "@authFeat/typings/Region";

import { useFetcher, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Content } from "@radix-ui/react-dialog";

import formatPhoneNumber from "@authFeat/utils/formatPhoneNumber";
import getSelectedRegion from "@authFeat/utils/getSelectedRegion";

import { useRegisterMutation } from "@authFeat/services/authApi";

import ModalTemplate from "@components/modals/ModalTemplate";
import { Button, Input, Select } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Spinner } from "@components/loaders";

import s from "./registerModal.module.css";

export default function RegisterModal() {
  const fetcher = useFetcher();
  console.log("fetcher", fetcher);

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
    { data: postData, error, isLoading: registerLoading, isSuccess },
  ] = useRegisterMutation();

  const countriesLoading = !!worldData.countries && !worldData.countries.length,
    regionsLoading = !!selected.country && !selected.regions.length;

  async function getCountries() {
    if (!worldData.countries?.length) {
      setWorldData((prev) => ({
        ...prev,
        countries: [],
      }));
      const countriesData = (await import("@authFeat/constants/COUNTRIES"))
        .default;
      setTimeout(() => {
        setWorldData((prev) => ({
          ...prev,
          countries: countriesData,
        }));
      }, 2000);
    }
  }

  async function getRegions() {
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
  }

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
      console.log("fetcher.state", fetcher.state);
      if (fetcher.data) {
        const res = await register(fetcher.data);
        console.log("RES", res);
      }
    })();
  }, [fetcher.data]);

  return (
    <ModalTemplate query="register" btnText="Register">
      {({ close }) => (
        <Content className={s.modal}>
          <Button intent="exit" size="xl" onClick={close} />

          <div className={s.head}>
            <hgroup>
              <Icon id="badge-48" />
              <h2>Register</h2>
            </hgroup>

            <div>
              <span>*</span> <span>Required</span>
            </div>
          </div>

          {fetcher.state !== "submitting" &&
            (isSuccess ? (
              <small>{postData.message}</small>
            ) : (
              error && (
                <small>
                  An unexpected internal error occurred. Please try refreshing
                  the page. If the error persists, reach out to{" "}
                  <Link to="/support">support</Link>.
                </small>
              )
            ))}
          <fetcher.Form
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
                  disabled={registerLoading}
                />
                <Input
                  label="Last Name"
                  intent="primary"
                  size="lrg"
                  id="lastName"
                  name="lastName"
                  required
                  error={fetcher.data?.errors?.lastName}
                  disabled={registerLoading}
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
                disabled={registerLoading}
              />
              <Input
                label="Username"
                intent="primary"
                size="lrg"
                id="username"
                name="username"
                required
                error={fetcher.data?.errors?.username}
                disabled={registerLoading}
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
                  disabled={registerLoading}
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
                  disabled={registerLoading}
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
                  disabled={registerLoading}
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
                  disabled={!selected.country || registerLoading}
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
                  Loader={() => <Spinner intent="primary" size="sm" />}
                  loaderTrigger={countriesLoading}
                  disabled={registerLoading}
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
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  error={fetcher.data?.errors?.phoneNumber}
                  onInput={(e) =>
                    formatPhoneNumber(e.target as HTMLInputElement)
                  }
                  disabled={registerLoading}
                />
              </div>
            </div>

            <div className={s.submit}>
              <Button
                intent="primary"
                size="xl"
                // type="submit"
                disabled={registerLoading}
              >
                Register
              </Button>
              <p>
                By Registering a profile, you agree to Quest Casino's{" "}
                <Link to="/terms" className="">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/terms" className="">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
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
              disabled={registerLoading}
            >
              <span>
                <Icon id="google-24" />
                Google
              </span>
            </Button>
          </fetcher.Form>

          <span>
            Already have a account? <Link to="/login">Log In</Link>
          </span>
        </Content>
      )}
    </ModalTemplate>
  );
}
