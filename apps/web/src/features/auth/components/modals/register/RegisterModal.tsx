import { useFormAction, useSubmit, Form } from "react-router-dom";
import { Link } from "react-router-dom";
import { Content } from "@radix-ui/react-dialog";

import COUNTRIES from "@authFeat/constants/COUNTRIES";

import ModalTemplate from "@components/modals/ModalTemplate";
import { Button, Input, Select } from "@components/common/controls";
import { Icon } from "@components/common/icon";

import s from "./registerModal.module.css";

export default function RegisterModal() {
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
          <Form
          // method="post"
          // action="/action/register"
          // autoComplete="off"
          // noValidate
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
                  //   error={error?.name}
                />
                <Input
                  label="Last Name"
                  intent="primary"
                  size="lrg"
                  id="lastName"
                  name="lastName"
                  required
                  //   error={error?.name}
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
                //   error={error?.name}
              />
              <Input
                label="Username"
                intent="primary"
                size="lrg"
                id="username"
                name="username"
                required
                //   error={error?.name}
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
                  //   error={error?.name}
                />
                <Input
                  label="Confirm Password"
                  intent="primary"
                  size="lrg"
                  id="conPassword"
                  name="conPassword"
                  type="password"
                  required
                  //   error={error?.name}
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
                  //   error={error?.name}
                />
                <Select
                  label="State"
                  intent="primary"
                  size="lrg"
                  id="state"
                  name="state"
                  required
                  //   error={error?.name}
                />
              </div>
              <div role="group">
                <Select
                  label="Code"
                  intent="callingCode"
                  size="lrg"
                  id="callingCode"
                  name="callingCode"
                  required
                  //   error={error?.name}
                >
                  {COUNTRIES.map((country) => (
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
                  type="number"
                  required
                  //   error={error?.name}
                />
              </div>
            </div>

            <div className={s.submit}>
              <Button
                intent="primary"
                size="xl"
                // type="submit"
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
            <Button aria-describedby="logWit" intent="secondary" size="xl">
              <span>
                <Icon id="google-24" />
                Google
              </span>
            </Button>
          </Form>

          <span>
            Already have a account? <Link to="/login">Log In</Link>
          </span>
        </Content>
      )}
    </ModalTemplate>
  );
}
