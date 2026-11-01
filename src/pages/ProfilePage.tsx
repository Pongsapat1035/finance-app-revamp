import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Check, CircleAlert, CircleCheck, LockKeyhole } from 'lucide-react'

import { changePassword } from '#/api/auth/auth.api'
import {
  deleteAccount,
  deleteAvatar,
  getAvatar,
  updateProfile,
  uploadAvatar,
} from '#/api/user/current-user.api'
import { AppPageShell } from '#/components/app-shell'
import ConfirmModal, {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/ConfirmModal'
import InputField from '#/components/ui/InputField'
import { useCurrentUser } from '#/hooks/useCurrentUser'
import useAuthStore from '#/store/authStore'

import type { ReactNode } from 'react'

function errorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message
    if (message) return Array.isArray(message) ? message.join(', ') : message
  }
  return fallback
}

export default function ProfilePage() {
  const { data: user, isError, isLoading } = useCurrentUser()
  const token = useAuthStore((state) => state.token)
  const clearToken = useAuthStore((state) => state.clearToken)
  const queryClient = useQueryClient()
  const userKey = ['current-user', token]
  const avatarKey = ['current-user-avatar', token]
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    setName(user?.name ?? '')
    setBio(user?.bio ?? '')
  }, [user?.id, user?.name, user?.bio])

  const avatar = useQuery({
    queryKey: avatarKey,
    queryFn: getAvatar,
    enabled: Boolean(user?.avatarUrl && token),
    retry: false,
  })
  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => {
    if (!user?.avatarUrl || !avatar.data) {
      setAvatarUrl('')
      return
    }
    const url = URL.createObjectURL(avatar.data)
    setAvatarUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [avatar.data, user?.avatarUrl])

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(userKey, updated)
      setNotice('Profile updated.')
    },
    onError: (err) =>
      setError(errorMessage(err, 'Could not update your profile. Please try again.')),
  })
  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updated) => {
      queryClient.setQueryData(userKey, updated)
      void queryClient.invalidateQueries({ queryKey: avatarKey })
      setNotice('Profile photo updated.')
    },
    onError: (err) => setError(errorMessage(err, 'Could not upload your photo. Please try again.')),
  })
  const removeAvatarMutation = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      queryClient.setQueryData(
        userKey,
        (previous: typeof user) => previous && { ...previous, avatarUrl: null },
      )
      queryClient.removeQueries({ queryKey: avatarKey })
      setNotice('Profile photo removed.')
    },
    onError: (err) => setError(errorMessage(err, 'Could not remove your photo. Please try again.')),
  })
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setNotice('Password changed.')
      void queryClient.invalidateQueries({ queryKey: userKey })
    },
    onError: (err) =>
      setPasswordError(errorMessage(err, 'Could not change your password. Please try again.')),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearToken()
      queryClient.clear()
    },
    onError: (err) =>
      setDeleteError(errorMessage(err, 'Could not delete your account. Please try again.')),
  })
  const initials = useMemo(
    () =>
      name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
    [name],
  )
  const photoPending = uploadMutation.isPending || removeAvatarMutation.isPending

  function clearMessages() {
    setNotice('')
    setError('')
  }

  return (
    <AppPageShell activeItem="Profile" periodLabel="Profile settings">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Personal account</p>
        <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
          Profile settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Update your personal details and account security.
        </p>
      </div>

      {(isError || error || avatar.isError) && (
        <p className="mt-6 text-sm text-destructive-text" role="alert">
          {error ||
            (isError
              ? 'Could not load your account details. Please try again.'
              : 'Could not load your profile photo.')}
        </p>
      )}
      {notice && (
        <div
          className="mt-6 flex items-center gap-2 rounded-sm bg-success-soft px-4 py-3 text-xs font-medium text-success-text"
          role="status"
        >
          <CircleCheck size={15} /> {notice}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            clearMessages()
            if (!user) return
            if (!name.trim() && user.name !== null) {
              setError('Full name cannot be empty.')
              return
            }
            profileMutation.mutate({
              ...(name.trim() ? { name: name.trim() } : {}),
              bio: bio === '' ? null : bio,
            })
          }}
        >
          <SettingsSection
            title="Personal details"
            description="Used across your finance workspace and exported reports."
          >
            {isLoading ? (
              <ProfileDetailsSkeleton />
            ) : (
              <>
                <div className="flex flex-col gap-5 border-b pb-5 sm:flex-row sm:items-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile photo"
                      className="size-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-16 shrink-0 place-items-center rounded-full bg-muted text-lg font-semibold">
                      {initials || '?'}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium">Profile photo</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG or PNG. Maximum file size 2 MiB.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <label className="relative flex h-9 cursor-pointer items-center rounded-sm border px-3 text-xs font-medium hover:bg-muted focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring has-disabled:cursor-not-allowed has-disabled:opacity-45">
                        Upload photo
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          aria-label="Upload photo"
                          className="absolute inset-0 w-full cursor-pointer opacity-0"
                          disabled={!user || photoPending || profileMutation.isPending}
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            event.target.value = ''
                            if (!file) return
                            clearMessages()
                            if (
                              !['image/jpeg', 'image/png'].includes(file.type) ||
                              file.size > 2 * 1024 * 1024
                            ) {
                              setError('Choose a JPEG or PNG image no larger than 2 MiB.')
                              return
                            }
                            uploadMutation.mutate(file)
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!user?.avatarUrl || photoPending || profileMutation.isPending}
                        onClick={() => {
                          clearMessages()
                          removeAvatarMutation.mutate()
                        }}
                        className="ds-focus-ring h-9 rounded-sm px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-45"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField
                    id="profile-name"
                    label="Full name"
                    placeholder="Your full name"
                    value={name}
                    disabled={!user || profileMutation.isPending}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <InputField
                    id="profile-email"
                    label="Email address"
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                  />
                  <label className="grid gap-2 text-[13px] font-medium sm:col-span-2">
                    Short bio
                    <textarea
                      value={bio}
                      disabled={!user || profileMutation.isPending}
                      onChange={(event) => setBio(event.target.value)}
                      rows={3}
                      className="resize-none rounded-sm border border-input bg-background px-3.5 py-3 text-sm font-normal transition-[border-color,box-shadow] duration-150 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none disabled:opacity-45 motion-reduce:transition-none"
                    />
                  </label>
                </div>
              </>
            )}
          </SettingsSection>
          <div className="flex justify-end border-t pt-5">
            <button
              type="submit"
              disabled={!user || profileMutation.isPending || photoPending}
              className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600] disabled:opacity-45"
            >
              <Check size={15} strokeWidth={2} />{' '}
              {profileMutation.isPending ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <SettingsSection title="Security" description="Manage your account password.">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-muted">
                <LockKeyhole size={17} />
              </span>
              <div>
                <p className="text-xs font-medium">Password</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {user?.hasPassword
                    ? user.passwordChangedAt
                      ? `Last changed ${new Date(user.passwordChangedAt).toLocaleDateString()}.`
                      : 'No password change date available.'
                    : user
                      ? 'This account does not have a password.'
                      : 'Loading account details.'}
                </p>
                {user?.hasPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError('')
                      setPasswordOpen(true)
                    }}
                    className="ds-focus-ring mt-2 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    Change password
                  </button>
                )}
              </div>
            </div>
          </SettingsSection>
          <section className="rounded-lg border border-destructive/35 p-5">
            <div className="flex items-center gap-2 text-destructive-text">
              <CircleAlert size={15} />
              <h2 className="text-sm font-medium">Delete account</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              This permanently removes your profile and personal finance data.
            </p>
            <button
              type="button"
              onClick={() => {
                setDeleteError('')
                setDeleteOpen(true)
              }}
              className="ds-focus-ring mt-5 h-9 rounded-sm border border-destructive/45 px-3 text-xs font-medium text-destructive-text hover:bg-destructive/5"
            >
              Delete account
            </button>
          </section>
        </aside>
      </div>
      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          if (!passwordMutation.isPending) {
            setPasswordOpen(open)
            if (!open) {
              setCurrentPassword('')
              setNewPassword('')
            }
          }
        }}
      >
        <DialogContent
          onEscapeKeyDown={(event) => passwordMutation.isPending && event.preventDefault()}
          onInteractOutside={(event) => passwordMutation.isPending && event.preventDefault()}
          showCloseButton={!passwordMutation.isPending}
        >
          <DialogTitle className="text-base font-medium">Change password</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Use at least 8 characters, including an uppercase English letter and a special
            character.
          </DialogDescription>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setPasswordError('')
              if (
                !currentPassword ||
                newPassword.length < 8 ||
                !/[A-Z]/.test(newPassword) ||
                !/[^A-Za-z0-9\s]/.test(newPassword)
              ) {
                setPasswordError(
                  'Enter your current password and a new password that meets the requirements.',
                )
                return
              }
              if (currentPassword === newPassword) {
                setPasswordError('Your new password must be different from your current password.')
                return
              }
              passwordMutation.mutate({ currentPassword, newPassword })
            }}
          >
            <InputField
              id="current-password"
              label="Current password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <InputField
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            {passwordError && (
              <p role="alert" className="text-sm text-destructive-text">
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="ds-focus-ring h-10 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-45"
            >
              {passwordMutation.isPending ? 'Changing...' : 'Change password'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete account?"
        description="Your account, personal finance data, and files will be permanently deleted. This cannot be undone."
        confirmLabel="Delete account"
        tone="destructive"
        loading={deleteMutation.isPending}
        error={deleteError}
        onConfirm={() => {
          setDeleteError('')
          deleteMutation.mutate()
        }}
      />
    </AppPageShell>
  )
}

function ProfileDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading personal details" className="motion-safe:animate-pulse">
      <div aria-hidden="true">
        <div className="flex flex-col gap-5 border-b pb-5 sm:flex-row sm:items-center">
          <div className="size-16 shrink-0 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded-sm bg-muted" />
            <div className="h-3 w-48 rounded-sm bg-muted" />
            <div className="h-9 w-40 rounded-sm bg-muted" />
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded-sm bg-muted" />
            <div className="h-10 rounded-sm bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded-sm bg-muted" />
            <div className="h-10 rounded-sm bg-muted" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-16 rounded-sm bg-muted" />
            <div className="h-[86px] rounded-sm bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-medium tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}
