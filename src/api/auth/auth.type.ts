export interface LoginUser {
  email: string
  password: string
}

export interface CreateUser extends LoginUser {
  name: string
}

export interface VerifyUser {
  userId: number
  otp: string
}

export interface ResendOtp {
  referral: string
  userId: number
}

export interface SignUpResponse {
  message: string
  data: {
    userId: number
    email: string
    expireIn: number
    referral: string
  }
}

export interface SignInResponse {
  token: string
}
