# API Gap Analysis

**Scope.** This document compares every routed product page with the client API layer currently present in `src/api/` and `src/hooks/`. It identifies APIs that are needed to replace hard-coded product data or make visible controls persist. Suggested paths are proposals, not a claim that the backend already exposes them.

## Current API coverage

| Area | Implemented client calls | Coverage |
| --- | --- | --- |
| Authentication | `POST /auth/signup`, `POST /auth/signin`, `POST /auth/verify`, `POST /otp/resent-otp` | Partial |
| Categories | Create, paginated list, update, delete under `/category` | CRUD present |
| Transactions | Create, paginated list, update, delete under `/transaction` | CRUD present |
| Dashboard, budgets, reports, profile, settings, connected accounts | None | Missing |

The transaction and category APIs are real integrations: their React Query hooks are used by the Transactions page and its modal. Every other authenticated page is driven by constants or local React state.

## Evidence of mock or non-persistent UI

| Product area | Evidence | Resulting gap |
| --- | --- | --- |
| Dashboard | `periodData`, `recentTransactions`, and `recurringPayments` in `src/routes/_authenticated/dashboard.tsx` | Summary, charts, category breakdown, recent activity, and recurring payments are not user data. |
| Transactions | `TransactionSummary` contains static July values; filter controls in `TransactionTable` have no state or query integration. | Summary and server-side filtering/search are missing. |
| Budgets | `budgetItems` and upcoming costs are constants; the create dialog only closes on submit. | The whole budget feature lacks persistence and derived spend data. |
| Reports | `sixMonthReport`, `reportRanges`, spending mix, and “What changed” content are constants. Export button has no handler. | Reporting, comparison, and export APIs are missing. |
| Profile | Starts as Mina Park / `mina@example.com`; save only sets a local `saved` flag. | Profile, avatar, security, sessions, and deletion APIs are missing. |
| Settings | Defaults and notification toggles live in component state; connected accounts are hard-coded. | Preference and financial-account APIs are missing. |
| Password recovery and OAuth | Forgot-password and OTP forms prevent default only; Google button has a TODO. | Recovery/reset and Google OAuth flows are missing or unwired. |

## Recommended API backlog

### P0 — required for the current screens to represent real user data

#### 1. Current user and session

| Need | Suggested operation | Used by |
| --- | --- | --- |
| Load current identity | `GET /me` | Sidebar name/initials, Profile, app bootstrap |
| Update personal details | `PATCH /me` with `name`, `bio`, and optionally an email-change request | Profile save |
| End a session | `POST /auth/logout` | Sign out (not currently exposed in UI, but required once sessions are server-managed) |
| Renew an expired access token | `POST /auth/refresh` or an httpOnly-cookie session strategy | Axios 401 recovery |

**Contract decision:** email should usually be changed through a separate verified flow, e.g. `POST /me/email-change/request` and `POST /me/email-change/confirm`, rather than a direct `PATCH /me`.

#### 2. Dashboard and transaction summaries

| Need | Suggested operation | Minimum response fields |
| --- | --- | --- |
| Header metrics | `GET /dashboard/summary?period=month&date=2026-07-01` | range, balance, income, expenses, net, savingsRate, transactionCount, averageSpend |
| Cash-flow chart | `GET /analytics/cash-flow?from=...&to=...&interval=day` | `[{ period, income, expense }]` |
| Expense categories | `GET /analytics/spending-by-category?from=...&to=...` | category id/name/color, amount, percent |
| Latest activity | Extend `GET /transaction` with `sort=-date&limit=5` | current transaction response is sufficient once sorting is supported |
| Transaction-page summary | `GET /transactions/summary?from=...&to=...` | income, expenses, net, counts by type |

The dashboard’s monthly/yearly switch and date picker should submit explicit range parameters. Do not make the server infer the client’s current month or timezone.

#### 3. Transaction list filtering

The client currently sends only `page` and `limit`. Add supported query parameters to `GET /transaction`:

```text
q                 Merchant/description/category search term
type              INCOME | EXPEND
categoryId        One category id (or a repeated/comma-separated list by API convention)
from, to          ISO 8601 date bounds
sort              date | amount | createdAt, with an explicit direction
page, limit       Existing pagination
```

This enables the Search, type, category, and “This month” controls already rendered in `TransactionTable`.

#### 4. Category retrieval for forms

`/transactions` fetches categories with `page=1&limit=10`. A user with more than ten categories will not be able to select the rest in the transaction form. Provide either:

- `GET /category?limit=100` with a documented maximum suitable for a selector; or
- `GET /category/options?type=INCOME|EXPEND` returning all active selectable categories.

Also document deletion behavior when a category already has transactions: reject with a clear conflict, archive it, or preserve a display snapshot. The UI currently assumes historical transactions remain after deletion.

### P1 — turns the budget and reporting prototypes into working features

#### 5. Budgets

| Need | Suggested operation | Notes |
| --- | --- | --- |
| List a month’s budgets and calculated spend | `GET /budgets?month=2026-07` | Return budget limit, category, spent amount, remaining, and status in one response. |
| Create a category budget | `POST /budgets` | Payload: `categoryId`, `month`, `amount`. Enforce one active budget per category/month. |
| Edit a limit | `PATCH /budgets/:id` | Supports the “Edit limits” interaction. |
| Delete/stop a budget | `DELETE /budgets/:id` | Must specify whether historical records remain. |
| Budget health/alerts | Include in list response or expose `GET /budgets/summary?month=...` | Returns totals, over-limit categories, and the threshold used for alerts. |

The next/previous-month controls must change the `month` request parameter. “Move money” needs a product decision: if it reallocates limits, model it as `POST /budgets/reallocations` with source budget, destination budget, amount, and month; otherwise remove the control.

#### 6. Recurring transactions and upcoming costs

Recurring payments appear on Dashboard and Budgets but have no data model. Add:

| Need | Suggested operation |
| --- | --- |
| Manage recurring rules | `GET/POST /recurring-transactions`, `PATCH/DELETE /recurring-transactions/:id` |
| Show imminent occurrences | `GET /recurring-transactions/upcoming?from=...&to=...` |
| Generate or record an occurrence | Product choice: server-generated transactions, or `POST /recurring-transactions/:id/occurrences` when confirmed by the user |

A rule should include category, type, amount, description, start date, cadence, next run date, and active state. Avoid representing upcoming costs as normal transactions before they actually occur.

#### 7. Reports and export

| Need | Suggested operation | Notes |
| --- | --- | --- |
| Cash-flow report | `GET /reports/cash-flow?from=...&to=...&interval=month` | Supplies chart, totals, net amount, and comparable prior-period values. |
| Spending mix | `GET /reports/spending-by-category?from=...&to=...` | Supplies categories, totals, percentage, colors. |
| Period-over-period insights | `GET /reports/changes?from=...&to=...&compareFrom=...&compareTo=...` | Enables “What changed”; client-side computation is acceptable for a small ledger, but it needs raw data. |
| Download | `GET /reports/export?format=csv|pdf&from=...&to=...` or `POST /reports/exports` for an asynchronous job | Set content type, filename, and authorization behavior explicitly. |

For all report endpoints, accept explicit `from`, `to`, client timezone, and currency. The app currently formats in USD while Settings allows THB and EUR, so the API must state whether it returns source amounts, converted amounts, and/or exchange rates.

### P2 — profile, preferences, and connected account capabilities

#### 8. Preferences and notification settings

| Need | Suggested operation | Fields |
| --- | --- | --- |
| Load preferences | `GET /preferences` | currency, timezone, monthStart, numberFormat, notification preferences |
| Save preferences | `PATCH /preferences` | Same fields; partial updates allowed |
| Notification delivery state | Include in `/preferences` or `GET/PATCH /notification-preferences` | weeklySummary, budgetAlerts, productUpdates, alert threshold |

The preference values should use durable identifiers (`USD`, `THB`, IANA timezone, enum for month start), not display strings from the select controls.

#### 9. Avatar, password, MFA, and active sessions

| Need | Suggested operation |
| --- | --- |
| Avatar upload | `POST /me/avatar/upload-url` then storage upload, followed by `PATCH /me` with the asset id; or a multipart `PUT /me/avatar` |
| Remove avatar | `DELETE /me/avatar` |
| Change password | `POST /auth/change-password` |
| Set up/verify/disable MFA | `POST /auth/mfa/setup`, `POST /auth/mfa/verify`, `DELETE /auth/mfa` |
| Review/revoke sessions | `GET /auth/sessions`, `DELETE /auth/sessions/:id`, and `DELETE /auth/sessions` for all other sessions |
| Delete account | `DELETE /me`, ideally protected by recent-password/MFA confirmation |

#### 10. Connected financial accounts

The Settings page displays checking, savings, card, balance, and last-refresh time as hard-coded data. At minimum, create an internal account model before adding any third-party aggregator:

| Need | Suggested operation |
| --- | --- |
| List accounts and balances | `GET /financial-accounts` |
| Add manual account | `POST /financial-accounts` |
| Edit/archive an account | `PATCH/DELETE /financial-accounts/:id` |
| Retrieve account-specific activity | `GET /transaction?accountId=...` |

If “Connect account” means bank aggregation, add an integration flow such as `POST /financial-account-connections/link-token`, `POST /financial-account-connections/exchange`, status/error retrieval, and a server-side sync job. Never accept bank credentials in this app’s API directly.

## Authentication flows that need correction or completion

1. The recovery form validates an email but makes no request. Add `POST /auth/password/forgot` and store recovery context separately from signup verification.
2. The OTP page is presentation-only even though `useVerifyUser` and `useResendOtp` exist. It should distinguish signup verification from password recovery and, after success, navigate to the appropriate next screen.
3. A password-reset completion screen and `POST /auth/password/reset` are absent.
4. Google sign-in is explicitly marked TODO. Choose redirect OAuth (`GET /auth/google/start` plus callback) or an ID-token exchange (`POST /auth/google`) and define how it returns/sets a session.
5. The API client attaches a bearer token but has no 401 response handling, token-expiry strategy, or server-side logout path.

## Product-model decision to make before implementation

The UI calls itself both a “personal workspace” and a workspace that can be deleted. There is no `workspaceId` in the current Category or Transaction contracts. Choose one model:

- **Single-user ledger:** all data is implicitly owned by the authenticated user; keep `DELETE /me` and remove or rename “Delete workspace.”
- **Multi-workspace ledger:** introduce a workspace resource, membership/roles, active workspace selection, and scope categories, transactions, budgets, preferences, and accounts by `workspaceId`.

This decision affects every P0/P1 endpoint and should precede connected-account sharing or invitations.

## Recommended implementation sequence

1. Define a shared error envelope, authentication/session behavior, and `GET /me`.
2. Add transaction filtering, transaction summary, complete category selector retrieval, and dashboard aggregate endpoints.
3. Replace Dashboard and Transactions summary mocks with those queries.
4. Add budget and recurring-transaction models; then replace the Budgets page mocks.
5. Build report aggregate/export endpoints; then connect Reports.
6. Add preferences, profile/security, and financial-account endpoints after the workspace ownership model is decided.

## Out of scope for this audit

No backend repository, OpenAPI document, or live API contract is present in this workspace. Therefore endpoint paths and request/response shapes above are recommendations derived from the frontend, not verified backend requirements.
