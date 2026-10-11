import { apiClient } from '../client'
import type {
  CreateUser,
  GoogleAuthorizationExchangePayload,
  GoogleAuthorizationExchangeResponse,
  GoogleAuthorizationLinkResponse,
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

export const getGoogleAuthorizationLink = () => {
  return apiClient.get<GoogleAuthorizationLinkResponse>('/auth/google/link')
}

export const postGoogleAuthorizationExchange = (payload: GoogleAuthorizationExchangePayload) => {
  return apiClient.post<GoogleAuthorizationExchangeResponse>('/auth/google/exchange', payload)
}

export const postVerifyOtp = (payload: VerifyUser) => {
  return apiClient.post('/auth/verify', payload)
}

export const postResendOtp = (payload: ResendOtp) => {
  return apiClient.post('/otp/resent-otp', payload)
}
