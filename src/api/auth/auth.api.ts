import { apiClient } from '../client'
import type {
  CreateUser,
  LoginUser,
  ResendOtp,
  SignInResponse,
  SignUpResponse,
  VerifyUser,
} from './auth.type'

export const postSignUp = (payload: CreateUser) => {
  return apiClient.post<SignUpResponse>('/auth/signup', payload)
}

export const postSignIn = (payload: LoginUser) => {
  return apiClient.post<SignInResponse>('/auth/signin', payload)
}

export const postVerifyOtp = (payload: VerifyUser) => {
  return apiClient.post('/auth/verify', payload)
}

export const postResendOtp = (payload: ResendOtp) => {
  return apiClient.post('/otp/resent-otp', payload)
}

