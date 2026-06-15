export function validateContactNumber(value) {
  if (!value) return null;
  if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits.";
  return null;
}

export function validateSignupPassword(value) {
  if (!value) return null;
  const errors = [];
  if (value.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(value)) errors.push("an uppercase letter");
  if (!/[a-z]/.test(value)) errors.push("a lowercase letter");
  if (!/[0-9]/.test(value)) errors.push("a number");
  if (!/[^A-Za-z0-9]/.test(value)) errors.push("a symbol");
  return errors.length ? `Password must include ${errors.join(", ")}.` : null;
}

export function validateEmail(value) {
  if (!value) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return null;
}
