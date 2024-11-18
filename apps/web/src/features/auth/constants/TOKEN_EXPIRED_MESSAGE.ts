const TOKEN_EXPIRED_MESSAGE = (type: "confirm password" | "reset password", errorMsg = "") =>
  `It appears your ${type === "confirm password" ? "reset" : "confirmation"} link has expired${errorMsg.includes("missing", -1) ? " or wasn't sent at all" : ""}. ${type === "confirm password" ? "Please request a new one." : "Please try again."}`;
export default TOKEN_EXPIRED_MESSAGE;
