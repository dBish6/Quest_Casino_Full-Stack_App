import type { ActionFunction } from "react-router-dom";
import type RegisterRequestDto from "@authFeat/dtos/RegisterRequestDto";

import { json } from "react-router-dom";
import capitalize from "@utils/capitalize";

const optionalFields = new Set(["region", "callingCode", "phone_number"]);

const registerAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData(),
    isValid = validate(formData);

  if (typeof isValid === "string") {
    const user = createRequestBodyObject(formData);
    return json({ message: isValid, user }, { status: 200 });
  } else {
    return json({ errors: isValid }, { status: 400 });
  }
};
export default registerAction;

function validate(formData: FormData) {
  const errors: Record<string, FormDataEntryValue> = {};

  for (const [key, value] of formData.entries()) {
    if (value === "callingCode") continue;
    const fieldValue = value.toString();

    if (fieldValue.length) {
      const errorMsg = validateField(key, fieldValue, formData);
      if (errorMsg) {
        if (errorMsg === "Passwords do not match.") {
          errors.password = errorMsg;
          errors.conPassword = errorMsg;
        } else {
          errors[
            key === "phone_number" && errorMsg.includes("calling code", -1)
              ? "callingCode"
              : key
          ] = errorMsg;
        }
      }
    } else if (!optionalFields.has(key)) {
      errors[key] =
        key === "conPassword"
          ? "Please confirm your password."
          : `${capitalize(key)} is required.`;
    }
  }

  return Object.keys(errors).length ? errors : "Successfully validated.";
}
function validateField(key: string, value: string, formData: FormData) {
  // prettier-ignore
  switch (key) {
    case "username":
      return validateUsername(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "conPassword":
      return confirmPassword(value, formData.get("password")!.toString());
    case "phone_number":
      return validatePhoneNumber(value, formData.get("callingCode")!.toString());
    default:
      return null;
  }
}

/**
 * Constraints:
 * - Min of 3 characters.
 * - Max of 24 characters.
 */
function validateUsername(username: string) {
  if (username.length < 3) return "You can make a better username then that...";
  else if (username.length > 24)
    return "Username can't be no more than 24 characters";
}

/**
 * Constraints:
 * - Valid email format.
 */
function validateEmail(email: string) {
  if (
    !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  )
    return "Invalid email.";
}

/**
 * Constraints:
 * - Min of 6 characters.
 * - Max of 128 characters.
 * - At least one uppercase letter.
 */
function validatePassword(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  else if (password.length > 128) return "Max of 128 characters exceeded.";
  else if (!/[A-Z]/.test(password))
    return "Password must contain at least one capital letter.";
}
function confirmPassword(conPassword: string, password: string) {
  if (conPassword !== password) return "Passwords do not match.";
}

/**
 * Constraints:
 * - Must be 14 characters because of the format.
 * - If a phone number is provided, the calling code is required.
 */
function validatePhoneNumber(phoneNumber: string, callingCode: string) {
  if (phoneNumber.length !== 14) return "Phone number is invalid.";
  else if (!callingCode.length) return "Enter your calling code.";
}

function createRequestBodyObject(formData: FormData) {
  const obj: RegisterRequestDto = {} as RegisterRequestDto;

  for (const [key, value] of formData.entries()) {
    if (key === "conPassword" || key === "callingCode") continue;
    const fieldValue = value.toString();
    obj.type = "standard";

    if (fieldValue && key === "phone_number") {
      obj.phone_number = `${formData.get("callingCode")} ${fieldValue}`;
    } else if (fieldValue && (key === "firstName" || key === "lastName")) {
      obj.legal_name = {
        ...(obj.legal_name || {}),
        [key.split("N")[0]]: fieldValue,
      };
    } else {
      // prettier-ignore
      obj[key as keyof Omit<RegisterRequestDto, "type" | "legal_name">] =
        optionalFields.has(key) ? fieldValue ? fieldValue : undefined : fieldValue;
    }
  }
  // console.log("obj", obj);

  return obj;
}
