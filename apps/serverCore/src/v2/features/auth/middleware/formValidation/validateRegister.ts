import type { Response, NextFunction } from "express";
import type { RegisterBodyDto } from "@qc/typescript/dtos/RegisterBodyDto";
import type { RegisterRequestDto } from "@authFeat/dtos/RegisterRequestDto";

import { logger } from "@qc/utils";
import capitalize from "@utils/capitalize";

const optionalFields = new Set(["region", "calling_code", "phone_number"]);

/**
 * Validates the standard register form fields.
 * @middleware
 */
export default async function validateRegister(
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) {
  const body = req.body,
    keys = Object.keys(body) as (keyof RegisterBodyDto)[];

  if (!keys.length || !body)
    return res.status(400).json({
      ERROR: "No form field values was given.",
    });

  const isValid = validate(body);
  if (typeof isValid === "string") {
    req.body = keys.reduce((acc, key) => {
      acc[key] = body[key] === null ? undefined : body[key];
      return acc;
    }, {} as any);

    logger.info(isValid);
    next();
  } else {
    return res.status(400).json({
      ERROR: isValid,
    });
  }
}

function validate(formData: RegisterBodyDto) {
  const errors: Partial<RegisterBodyDto> = {};

  for (const [k, v] of Object.entries(formData)) {
    if (v === "calling_code") continue;
    const key = k as keyof RegisterBodyDto,
      value: string = v;

    if (value && value.length) {
      const errorMsg = validateField(
        key as keyof RegisterBodyDto,
        value,
        formData
      );
      if (errorMsg) {
        // TODO: If there is a password error message, just show the password error message.
        if (errorMsg === "Passwords do not match.") {
          errors.password = errorMsg;
          errors.con_password = errorMsg;
        } else {
          errors[
            key === "phone_number" && errorMsg.includes("calling code", -1)
              ? "calling_code"
              : key
          ] = errorMsg;
        }
      }
    } else if (!optionalFields.has(key)) {
      errors[key] =
        key === "con_password"
          ? "Please confirm your password."
          : `${capitalize(key)} is required.`;
    }
  }

  return Object.keys(errors).length
    ? errors
    : "Register form submission successfully validated.";
}

function validateField(
  key: keyof RegisterBodyDto,
  value: string,
  formData: RegisterBodyDto
) {
  switch (key) {
    case "username":
      return validateUsername(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "con_password":
      return confirmPassword(value, formData.password);
    case "phone_number":
      return validatePhoneNumber(value, formData.calling_code!);
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
export function validatePassword(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  else if (password.length > 128) return "Max of 128 characters exceeded.";
  else if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
}
export function confirmPassword(conPassword: string, password: string) {
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
