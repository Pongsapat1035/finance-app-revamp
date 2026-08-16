import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, Check, CircleAlert, CircleCheck, LockKeyhole, ShieldCheck } from 'lucide-react'

import { AppPageShell } from '#/components/app-shell'
import InputField from '#/components/ui/InputField'

import type { ReactNode } from 'react'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: 'Profile settings | My Finance' },
      { name: 'description', content: 'Manage personal details and account security.' },
    ],
  }),
})

function ProfilePage() {
  const [name, setName] = useState('Mina Park')
  const [email, setEmail] = useState('mina@example.com')
  const [saved, setSaved] = useState(false)
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

  return (
    <AppPageShell
      activeItem="Profile"
      searchLabel="Search profile settings"
      periodLabel="Profile settings"
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">Personal account</p>
        <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
          Profile settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Update your personal details, sign-in method, and account security preferences.
        </p>
      </div>

      <nav className="mt-8 flex gap-6 overflow-x-auto border-b" aria-label="Settings sections">
        <Link
          to="/settings"
          className="ds-focus-ring relative shrink-0 pb-3 text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          General settings
        </Link>
        <span className="relative shrink-0 pb-3 text-sm font-medium text-foreground">
          Profile and security
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
        </span>
      </nav>

      {saved && (
        <div
          className="mt-6 flex items-center gap-2 rounded-sm bg-success-soft px-4 py-3 text-xs font-medium text-success"
          role="status"
        >
          <CircleCheck size={15} /> Profile updated.
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSaved(true)
          }}
          className="space-y-6"
        >
          <SettingsSection
            title="Personal details"
            description="Used across your finance workspace and exported reports."
          >
            <div className="flex flex-col gap-5 border-b pb-5 sm:flex-row sm:items-center">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#ded0d2] text-lg font-semibold">
                {initials || 'MP'}
              </span>
              <div>
                <p className="text-sm font-medium">Profile photo</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG or PNG. Maximum file size 2 MB.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="ds-focus-ring h-9 rounded-sm border px-3 text-xs font-medium hover:bg-muted"
                  >
                    Upload photo
                  </button>
                  <button
                    type="button"
                    className="ds-focus-ring h-9 rounded-sm px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
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
                onChange={(event) => setName(event.target.value)}
              />
              <InputField
                id="profile-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <label className="grid gap-2 text-[13px] font-medium sm:col-span-2">
                Short bio
                <textarea
                  defaultValue="Personal finance workspace owner."
                  rows={3}
                  className="ds-focus-ring resize-none rounded-sm border border-input bg-background px-3.5 py-3 text-sm font-normal"
                />
                <span className="text-[11px] font-normal text-muted-foreground">
                  Shown only to people you invite to this workspace.
                </span>
              </label>
            </div>
          </SettingsSection>
          <div className="flex justify-end border-t pt-5">
            <button
              type="submit"
              className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]"
            >
              <Check size={15} strokeWidth={2} /> Save profile
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <SettingsSection
            title="Security"
            description="Your account is protected with password sign-in."
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-success-soft text-success">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <p className="text-xs font-medium">Two-step verification</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    Add a second check when you sign in.
                  </p>
                  <button
                    type="button"
                    className="ds-focus-ring mt-2 text-xs font-medium underline decoration-border underline-offset-4"
                  >
                    Set up
                  </button>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-muted">
                    <LockKeyhole size={17} />
                  </span>
                  <div>
                    <p className="text-xs font-medium">Password</p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      Last changed 3 months ago.
                    </p>
                    <button
                      type="button"
                      className="ds-focus-ring mt-2 text-xs font-medium underline decoration-border underline-offset-4"
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          <section className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <Bell size={15} />
              <h2 className="text-sm font-medium">Active sessions</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              You are signed in on this Mac and one mobile device.
            </p>
            <button
              type="button"
              className="ds-focus-ring mt-5 h-9 rounded-sm border px-3 text-xs font-medium hover:bg-muted"
            >
              Review sessions
            </button>
          </section>

          <section className="rounded-lg border border-destructive/35 p-5">
            <div className="flex items-center gap-2 text-destructive">
              <CircleAlert size={15} />
              <h2 className="text-sm font-medium">Delete account</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              This permanently removes your profile and personal finance data.
            </p>
            <button
              type="button"
              className="ds-focus-ring mt-5 h-9 rounded-sm border border-destructive/45 px-3 text-xs font-medium text-destructive hover:bg-destructive/5"
            >
              Delete account
            </button>
          </section>
        </aside>
      </div>
    </AppPageShell>
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
