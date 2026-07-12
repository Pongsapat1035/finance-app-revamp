export const apiErrorMsg = {
  UNVERIFIED_USER: 'account is not verified',
  INCORRECT_CREDENTIAL: 'not match',
} as const



export type ApiErrorMsgKey = keyof typeof apiErrorMsg
