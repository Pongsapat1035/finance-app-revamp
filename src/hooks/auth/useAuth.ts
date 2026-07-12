import { useMutation } from '@tanstack/react-query'
import {
  postResendOtp,
  postSignIn,
  postSignUp,
  postVerifyOtp,
} from '#/api/auth/auth.api'
import type {
  CreateUser,
  LoginUser,
  SignInResponse,
  SignUpResponse,
} from '#/api/auth/auth.type'
import { useNavigate } from '@tanstack/react-router'
import { handleAxiosError, type HandledError } from '@/lib/handleAxiosError'
import useAuthStore from '#/store/authStore'


export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation<SignUpResponse, Error, CreateUser>({
    mutationFn: postSignUp,
    onSuccess: (data: SignUpResponse) => {
      sessionStorage.setItem(
        'otpContext',
        JSON.stringify({
          userId: data.data.userId,
          email: data.data.email,
          expireAt: Date.now() + data.data.expireIn * 1000,
          referral: data.data.referral,
        }),
      )
      navigate({ to: '/auth/otp' })
    },
    onError: (err) => console.log(err),
  })
}

export const useSignIn = (onError?: (errMsg: HandledError) => void) => {
  const navigate = useNavigate()
  const { setToken } = useAuthStore()

  return useMutation<SignInResponse, Error, LoginUser>({
    mutationFn: postSignIn,
    onSuccess: (data: SignInResponse) => {
      const { token } = data
      setToken(token)
      navigate({ to: '/dashboard' })
    },
    onError: (err) => onError?.(handleAxiosError(err)),
  })
}

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: (otp: string) => {
      const otpContext = JSON.parse(
        sessionStorage.getItem('otpContext') ?? 'null',
      )
      console.log(otpContext)
      return postVerifyOtp({ otp, userId: otpContext.userId })
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err),
  })
}

export const useResendOtp = () => {
  return useMutation({
    mutationFn: () => {
      const otpContext = JSON.parse(
        sessionStorage.getItem('otpContext') ?? 'null',
      )

      if (!otpContext) throw new Error('otp context not found')

      return postResendOtp({
        userId: otpContext.userId,
        referral: otpContext.referral,
      })
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err),
  })
}
