// ── Auth Form Validators ──────────────────────────────────────────────────────
// All validators follow the @tanstack/react-form convention:
//   return a string message on failure, or undefined on success.

// ── Regex patterns ────────────────────────────────────────────────────────────

const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HAS_NUMBER_REGEX = /[0-9]/
const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

// ── Validators ────────────────────────────────────────────────────────────────

export const validateName = (value: string): string | undefined => {
  if (!value || value.trim().length === 0) return "Full name is required."
  if (!FULL_NAME_REGEX.test(value.trim())) return "Full name must contain only letters."
  return undefined
}

export const validateEmail = (value: string): string | undefined => {
  if (!value || value.trim().length === 0) return "Email is required."
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address."
  return undefined
}

export const validatePassword = (value: string): string | undefined => {
  if (!value) return "Password is required."
  if (value.length < 8) return "Password must be at least 8 characters."
  if (!HAS_NUMBER_REGEX.test(value)) return "Password must contain at least one number."
  if (!HAS_SPECIAL_CHAR_REGEX.test(value)) return "Password must contain at least one special character."
  return undefined
}

export const validateConfirmPassword = (
  value: string,
  password: string,
): string | undefined => {
  if (!value) return "Please confirm your password."
  if (value !== password) return "Passwords do not match."
  return undefined
}

export const validateTerms = (value: boolean): string | undefined => {
  if (!value) return "You must agree to the terms and conditions."
  return undefined
}
