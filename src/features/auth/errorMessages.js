const BASE = {
  UsernameExistsException: "An account with this email already exists.",
  AliasExistsException: "An account with this email already exists.",
  InvalidPasswordException:
    "Your password doesn't meet the requirements. Use at least 8 characters with uppercase, lowercase, a number, and a symbol.",
  InvalidParameterException:
    "Some of the information you entered isn't valid. Please check and try again.",
  CodeMismatchException: "The code you entered is incorrect. Please try again.",
  ExpiredCodeException: "This code has expired. Please request a new one.",
  CodeDeliveryFailureException:
    "We couldn't send the verification code. Please try again.",
  LimitExceededException:
    "Too many attempts. Please wait a few minutes and try again.",
  TooManyRequestsException:
    "Too many requests. Please wait a moment and try again.",
  TooManyFailedAttemptsException:
    "Too many failed attempts. Please try again later.",
  NotAuthorizedException: "Incorrect email or password.",
  UserNotFoundException: "We couldn't find an account for this email.",
  UserNotConfirmedException:
    "Please verify your email before signing in.",
  PasswordResetRequiredException:
    "Please reset your password to continue.",
  NetworkError: "Network issue. Please check your connection and try again.",
};

const CONTEXT_OVERRIDES = {
  otpVerify: {
    NotAuthorizedException: "This account is already verified. Please log in.",
    InvalidParameterException: "The code you entered isn't valid. Please try again.",
  },
  otpResend: {
    InvalidParameterException: "This account is already verified. Please log in.",
    NotAuthorizedException: "This account is already verified. Please log in.",
  },
  forgotPasswordRequest: {
    InvalidParameterException:
      "Please verify your email first, then try again.",
  },
};

export function friendlyAuthError(
  input,
  context,
  fallback = "Something went wrong. Please try again.",
) {
  if (!input) return fallback;
  const code = typeof input === "string" ? input : input?.code || input?.message || "";
  if (!code) return fallback;
  const override = CONTEXT_OVERRIDES[context]?.[code];
  if (override) return override;
  if (BASE[code]) return BASE[code];
  if (/^[A-Z][A-Za-z]+Exception$/.test(code)) return fallback;
  return code;
}
