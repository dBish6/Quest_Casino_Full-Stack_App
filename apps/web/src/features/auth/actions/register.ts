import { type ActionFunction, json } from "react-router-dom";

const optionalFields = new Set(["state", "callingCode", "phoneNumber"]);

const registerAction: ActionFunction = async ({ request }) => {
  console.log("request", request);
  const formData = await request.formData(),
    isValid = validate(formData);

  console.log("form", formData);
  console.log("form entries", formData.entries());

  if (typeof isValid === "string") {
    return json({ message: isValid }, { status: 200 });
  } else {
    return json({ errors: isValid }, { status: 400 });
  }
};
export default registerAction;

function validate(formData: FormData) {
  const errors: Record<string, FormDataEntryValue> = {};

  for (const [key, value] of formData.entries()) {
    const fieldValue = value.toString();

    if (fieldValue.length) {
      const errorMsg = validateField(key, fieldValue, formData);
      if (errorMsg) {
        errors[key] = errorMsg;
      }
    } else if (!optionalFields.has(key)) {
      errors[key] = `${key} is required.`;
    }
  }

  console.log("errors", errors);

  return Object.keys(errors).length ? errors : "Successfully registered.";
}

function validateField(key: string, value: string, formData: FormData) {
  switch (key) {
    case "username":
      return validateUsername(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "conPassword":
      return confirmPassword(value, formData.get("password")!.toString());
    default:
      return null;
  }
}

/**
 * Constraints:
 * - Min 3 characters.
 * - Max 24 characters.
 */
function validateUsername(username: string) {
  if (username.length < 3) return "You can make a better username then that...";
  else if (username.length > 24)
    return "Username can be no more then 24 characters";
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
 * - Min 6 characters.
 * - Max 128 characters.
 * - At least one uppercase letter.
 */
function validatePassword(password: string) {
  if (password.length < 3) return "Password must be at least 6 characters.";
  else if (password.length > 128) return "Max of 128 characters exceeded.";
  else if (!/[A-Z]/.test(password))
    return "Password must contain at least one capital letter.";
}

function confirmPassword(conPassword: string, password: string) {
  if (conPassword !== password) return "Passwords do not match.";
}
