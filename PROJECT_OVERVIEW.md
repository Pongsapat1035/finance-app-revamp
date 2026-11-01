# Finance App (Ledgr) — Frontend + Backend

แอปบันทึกรายรับ-รายจ่ายส่วนตัว แบ่งเป็น 2 ส่วน

- **Frontend** (repo นี้) — เว็บแอป React ที่แสดง Dashboard, รายการธุรกรรม, งบประมาณ, รายการประจำ และโปรไฟล์
- **Backend** — REST API (NestJS + PostgreSQL) ที่เก็บข้อมูลและคำนวณสรุปต่าง ๆ

เอกสารนี้อ้างอิงจากโค้ดและ git history ของ repo นี้ ส่วน backend อ้างอิงจากเอกสาร README ของ backend ที่ผู้ใช้ให้มา ข้อมูลฝั่ง frontend ระบุไฟล์ที่มาไว้ในวงเล็บหรือคอลัมน์ "ที่มา"

---

## 1. ภาพรวมระบบ

```
┌──────────────────────────────┐        HTTPS / JSON         ┌────────────────────────────────┐
│ Frontend (repo นี้)          │  Authorization: Bearer JWT  │ Backend (NestJS 11)            │
│ TanStack Start + React 19    │ ──────────────────────────► │ controller → service → Prisma  │
│ Axios + TanStack Query       │ ◄────────────────────────── │ PostgreSQL                     │
│ base URL = VITE_API_BASE_URL │                             │ Google Cloud Run               │
└──────────────────────────────┘                             └────────────────────────────────┘
```

- Frontend อ่าน base URL จากตัวแปร `VITE_API_BASE_URL` และ throw error ทันทีถ้าไม่ได้ตั้งค่า (`src/api/client.ts`)
- Token ถูกแนบเป็น `Authorization: Bearer <token>` ทุก request ผ่าน Axios interceptor และถ้า response เป็น 401 จะล้าง token ทิ้ง (`src/api/client.ts`)
- Backend รับและส่งจำนวนเงินเป็น **บาท** (เก็บในฐานข้อมูลเป็นสตางค์) ฝั่ง frontend จัดรูปแบบตัวเลขด้วย `formatNumber` (`src/lib/format.ts`)

---

## 2. Frontend

### 2.1 Technology ที่ใช้

| กลุ่ม           | เทคโนโลยี                                                                                                          | ที่มา                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Framework       | TanStack Start (`@tanstack/react-start`) + TanStack Router แบบ file-based routing                                  | `package.json`, `vite.config.ts`, `src/routes/`           |
| UI library      | React 19.2                                                                                                         | `package.json`                                            |
| Language        | TypeScript 6 (strict, `noUnusedLocals`, `noUnusedParameters`)                                                      | `package.json`, `tsconfig.json`                           |
| Build / server  | Vite 8, `nitro` (Vite plugin)                                                                                      | `vite.config.ts`                                          |
| Data fetching   | TanStack Query + Axios (`ApiClient` class พร้อม interceptor)                                                       | `src/api/client.ts`, `src/hooks/*`                        |
| SSR + Query     | `@tanstack/react-router-ssr-query`                                                                                 | `src/router.tsx`                                          |
| Client state    | Zustand 5 + `persist` (เก็บ token ใน `localStorage` key `auth-storage`)                                            | `src/store/authStore.ts`                                  |
| Form            | TanStack Form (`@tanstack/react-form`)                                                                             | `TransactionForm.tsx`, `SignInForm.tsx`, `SignUpForm.tsx` |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`      | `package.json`, `src/styles.css`                          |
| Component base  | shadcn (style `new-york`, ปรับแต่งตาม design tokens) + Radix UI (checkbox, dialog, dropdown-menu, popover, select) | `components.json`, `package.json`                         |
| Icon            | Lucide (`lucide-react`)                                                                                            | `package.json`, `design.md`                               |
| Date            | dayjs, `react-day-picker` 10                                                                                       | `package.json`, `src/components/ui/DatePicker.tsx`        |
| Test            | Vitest 4, jsdom 28, Testing Library (react, dom)                                                                   | `package.json`                                            |
| Lint / format   | ESLint 10 + typescript-eslint + `eslint-plugin-react-hooks` + TanStack query/router plugins, Prettier 3            | `package.json`, `eslint.config.js`                        |
| Dev tools       | TanStack Devtools (Vite plugin ตอน `serve`), Router/Query devtools โหลดเฉพาะ `import.meta.env.DEV`                 | `vite.config.ts`, `src/routes/__root.tsx`                 |
| Package manager | Yarn 1.22.22                                                                                                       | `package.json`                                            |

### 2.2 โครงสร้างโค้ด

```
src/
├── api/            # แยกตาม domain: *.api.ts (เรียก endpoint) + *.type.ts (type ของ request/response)
│   ├── auth/  budget/  category/  recurring-transaction/  summary/  transaction/  user/
│   ├── client.ts   # ApiClient (Axios) + interceptor แนบ token / ล้าง token เมื่อ 401
│   └── types.ts    # PaginatedResponse, PaginationParams
├── hooks/          # TanStack Query hooks ต่อ domain (useBudget, useTransaction, ...)
├── pages/          # หน้าจอจริง (route file เป็นแค่ตัวผูก path กับ page)
├── routes/         # file-based routes ของ TanStack Router
├── components/
│   ├── ui/         # primitive ตาม design system (Button, DataTable, DatePicker, IconPicker, Toast, ...)
│   ├── auth/  transactions/  budgets/  recurring/  icons/
│   └── app-shell.tsx   # AppSidebar / AppTopBar / AppPageShell
├── store/          # authStore (Zustand)
├── lib/            # format, handleAxiosError, validators, utils
└── enum/           # TransactionType (EXPEND | INCOME | INVESTMENT)
```

- Path alias: `#/*` และ `@/*` ชี้ไปที่ `src/*` (`tsconfig.json`, `package.json`)
- แต่ละ domain มี 3 ชั้น คือ `api/<domain>` → `hooks/use<Domain>` → `pages/` และ component

### 2.3 หน้าจอและ route

| Path                    | หน้า                              | ต้อง login       | ข้อมูลจาก backend                                   |
| ----------------------- | --------------------------------- | ---------------- | --------------------------------------------------- |
| `/`                     | `HomePage` (หน้าแนะนำผลิตภัณฑ์)   | ไม่ (guest-only) | ไม่มี                                               |
| `/auth`                 | สมัคร / เข้าสู่ระบบ + ปุ่ม Google | ไม่ (guest-only) | ใช่                                                 |
| `/auth/otp`             | กรอก OTP ยืนยันอีเมล              | ไม่ (guest-only) | ใช่                                                 |
| `/auth/forgot-password` | ลืมรหัสผ่าน                       | ไม่ (guest-only) | ไม่ (ไม่มีการเรียก API ใน `ForgotPasswordPage.tsx`) |
| `/auth/google/callback` | แลก handoff code เป็น JWT         | ไม่              | ใช่                                                 |
| `/dashboard`            | ภาพรวมการเงิน                     | ใช่              | บางส่วน (ดูข้อ 4)                                   |
| `/transactions`         | รายการธุรกรรม + จัดการหมวดหมู่    | ใช่              | ใช่                                                 |
| `/budgets`              | งบประมาณรายเดือน                  | ใช่              | ใช่                                                 |
| `/recurring`            | รายการประจำ                       | ใช่              | ใช่                                                 |
| `/profile`              | โปรไฟล์                           | ใช่              | อ่านอย่างเดียว (ดูข้อ 4)                            |
| `/design-system`        | หน้าอ้างอิง design system         | ไม่              | ไม่มี                                               |

ที่มา: `src/routes/**`, `src/routes/__root.tsx` (กฎ guest-only: ถ้า login แล้วจะถูกส่งไป `/dashboard`), `src/routes/_authenticated.tsx` (route guard: ถ้ายังไม่ login จะส่งไป `/auth?redirect=...`)

### 2.4 สิ่งที่ frontend ทำได้ในแต่ละหน้า

**Authentication** (`src/hooks/useAuth.ts`, `src/pages/auth/GoogleCallbackPage.tsx`)

- สมัครด้วยอีเมล → เก็บ context ใน `sessionStorage` (`otpContext`) → ไปหน้า OTP → ยืนยัน / ขอ OTP ใหม่
- เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน แล้วเก็บ token ใน store
- Redirect หลัง login ยอมเฉพาะ origin เดียวกันและ path ที่อยู่ใน allow-list (`/dashboard`, `/transactions`, `/budgets`, `/recurring`, `/profile`) นอกนั้นกลับไป `/dashboard`
- Google Sign-In: เรียก `GET /auth/google/link` แล้ว redirect ไป Google → callback รับ `code` จาก query → `POST /auth/google/exchange` → เก็บ token → ลบ `code` ออกจาก URL ด้วย `history.replaceState`

**Transactions** (`src/pages/TransactionsPage.tsx`)

- ตารางรายการพร้อม pagination, ค้นหาด้วย keyword (debounce), กรองตามประเภท / หมวดหมู่ / เดือน
- เพิ่ม / แก้ไข / ลบรายการ (modal + confirm dialog + toast)
- สรุปยอดของเดือนที่เลือก จาก `GET /summary/transaction?month=` (`TransactionSummary.tsx`) โดย response มี `income`, `expenses`, `investment`, `net` และจำนวนรายการแต่ละประเภท (`src/api/summary/summary.type.ts`)
- จัดการหมวดหมู่ (สร้าง / แก้ไข / ลบ) ผ่าน `CategoryManager`

**Budgets** (`src/pages/BudgetsPage.tsx`)

- เลือกเดือน → ดูงบที่ตั้งไว้เทียบยอดใช้จริง (planned / spent / remaining / percentUsed)
- รายการหมวดที่ใช้เกินงบ (`/budget/exceeded`)
- สร้าง / แก้ไข / ลบงบ และแสดงรายการประจำที่จะครบกำหนด

**Recurring** (`src/pages/RecurringPage.tsx`)

- รายการประจำพร้อมค้นหา, กรองตามหมวดหมู่, pagination
- สร้าง / แก้ไข / ลบ (วันที่ของเดือน, วันเริ่ม, วันสิ้นสุด, เปิด/ปิดใช้งาน)
- แสดงรายการที่จะครบกำหนดภายใน 30 วัน

**Dashboard** (`src/pages/DashboardPage.tsx`)

- "Latest transactions" ดึง 5 รายการล่าสุดจาก API จริง
- "Upcoming recurring" ดึงจาก `/recurring-transaction/upcoming`

**Profile** (`src/pages/ProfilePage.tsx`)

- แสดงชื่อ / อีเมลของผู้ใช้จาก `GET /me`; sidebar ใช้ข้อมูลเดียวกัน (`app-shell.tsx`, `useCurrentUser`)

### 2.5 Endpoint ที่ frontend เรียกใช้

| Domain        | Method + Path                                                                                                                                                                                               | ไฟล์                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Auth          | `POST /auth/signup`, `POST /auth/signin`, `POST /auth/verify`, `POST /otp/resent-otp`                                                                                                                       | `src/api/auth/auth.api.ts`                                   |
| Auth (Google) | `GET /auth/google/link`, `POST /auth/google/exchange`                                                                                                                                                       | `src/api/auth/auth.api.ts`                                   |
| User          | `GET /me`                                                                                                                                                                                                   | `src/api/user/current-user.api.ts`                           |
| Category      | `POST /category`, `GET /category`, `PATCH /category/:id`, `DELETE /category/:id`                                                                                                                            | `src/api/category/category.api.ts`                           |
| Transaction   | `POST /transaction`, `GET /transaction`, `PUT /transaction/:id`, `DELETE /transaction/:id`                                                                                                                  | `src/api/transaction/transaction.api.ts`                     |
| Summary       | `GET /summary/transaction?month=`                                                                                                                                                                           | `src/api/summary/summary.api.ts`                             |
| Budget        | `POST /budget`, `GET /budget?period=`, `GET /budget/exceeded?period=`, `GET /budget/:id`, `PATCH /budget/:id`, `DELETE /budget/:id`                                                                         | `src/api/budget/budget.api.ts`                               |
| Recurring     | `POST /recurring-transaction`, `GET /recurring-transaction`, `GET /recurring-transaction/upcoming`, `GET /recurring-transaction/:id`, `PUT /recurring-transaction/:id`, `DELETE /recurring-transaction/:id` | `src/api/recurring-transaction/recurring-transaction.api.ts` |

การ invalidate cache: เมื่อสร้าง / แก้ไข / ลบ transaction หรือ category จะ invalidate query key `budget` ด้วย เพื่อให้ยอดใช้จริงในหน้างบประมาณอัปเดตตาม (`src/hooks/useTransaction.ts`, `src/hooks/useCategory.ts`)

### 2.6 Design system

- `design.md` เป็น source of truth ของ design (token สี, typography, spacing, radius, component, motion, copywriting) สไตล์อ้างอิงจาก Ramp แต่ไม่ใช่การคัดลอก
- Token อยู่ใน `src/styles.css` และเปิดให้ Tailwind v4 ใช้ผ่าน `@theme inline`
- มีหน้า `/design-system` (`src/pages/DesignSystemPage.tsx`) เป็นตัวอ้างอิงแบบ live
- `AGENTS.md` กำหนดว่างานที่แก้ UI ต้องอ่าน `design.md` และ `/design-system` ก่อนทุกครั้ง
- `design.md` และ `AGENTS.md` อ้างถึงภาพอ้างอิงในโฟลเดอร์ `design-ref/` แต่โฟลเดอร์นี้ไม่มีอยู่ใน working tree ตอนนี้

### 2.7 Testing, CI

- Vitest: **52 test cases** ใน 18 ไฟล์ (นับจาก `it(` / `test(` ใน `*.test.ts(x)`)
  - ครอบคลุม API layer (auth, recurring, current user), hooks (`useCurrentUser`), UI primitives (Pagination, DatePicker, Toast, IconPicker), หน้า Transactions / Budgets / Profile, app shell, route guard, `format`
- GitHub Actions `ci.yml` รันเมื่อเปิด Pull Request เข้า `main` บน Node 24:
  `yarn install --frozen-lockfile` → `typecheck` → `test` → `format:check` → `lint`
- ใน repo ไม่มี workflow สำหรับ deploy frontend; commit `0f0bb4d` ระบุว่าเพิ่ม `nitro` "for vercel deploy"

---

## 3. สิ่งที่ถูกแก้ไข / เปลี่ยนแปลงในรอบล่าสุด

### 3.1 ประวัติ commit (จาก `git log`, 41 commits)

| ช่วง                   | สิ่งที่ทำ                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| เริ่มต้น               | `933b8c6` นำ core function มาจาก repo เดิม (merge commit `c1c321a` อ้างถึง `finance-app-revamp`), แยก auth form, เพิ่ม protected route, base UI components |
| Transaction / Category | เชื่อม category CRUD และ transaction CRUD กับ API, flow เพิ่ม / แก้ไข / ลบ พร้อม confirm และ toast                                                         |
| App shell + CI         | shared sidebar / top bar, scaffold TanStack Query, เพิ่ม ESLint, Prettier, CI workflow                                                                     |
| ตาราง / filter         | table primitives, ค้นหา, filter ผูกกับ API, test ครอบ loading และ category recovery                                                                        |
| Auth                   | ล้าง token เมื่อ 401, Google OAuth (`4f98859`)                                                                                                             |
| Budget / Recurring     | `8fa191f` งบประมาณจริงและจัดการรายการประจำ                                                                                                                 |
| ล่าสุดที่ commit แล้ว  | `a54fb0e` รวม toast, `f5d74a6` เชื่อม current user API + app shell                                                                                         |

### 3.2 การเปลี่ยนแปลงที่ยังไม่ commit (จาก `git status` / `git diff --stat`)

tracked files แก้ไข 22 ไฟล์ (+471 / −1,258 บรรทัด) และมีไฟล์ใหม่ที่ยังไม่ track

| การเปลี่ยนแปลง              | รายละเอียด                                                                                                                                                                                   | ไฟล์                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ย้าย Dashboard ออกจาก route | `routes/_authenticated/dashboard.tsx` เหลือเป็นตัวผูก path กับ `DashboardPage` (diff แสดงว่าไฟล์นี้เปลี่ยน 491 บรรทัด ส่วนใหญ่เป็นการลบ) และเนื้อหาไปอยู่ใน `DashboardPage.tsx` (565 บรรทัด) | `src/routes/_authenticated/dashboard.tsx`, `src/pages/DashboardPage.tsx` (ใหม่)                                |
| ลบหน้า mockup               | ลบ `/reports` และ `/settings`                                                                                                                                                                | `src/routes/_authenticated/reports.tsx`, `settings.tsx` (deleted)                                              |
| เพิ่มหน้า Recurring         | หน้า + route ใหม่                                                                                                                                                                            | `src/pages/RecurringPage.tsx`, `src/routes/_authenticated/recurring.tsx` (ใหม่)                                |
| Summary API                 | เพิ่ม client เรียก `/summary/transaction` และ hook `useFetchTransactionSummary` ต่อเข้า `TransactionSummary`                                                                                 | `src/api/summary/` (ใหม่), `src/hooks/useTransaction.ts`, `src/components/transactions/TransactionSummary.tsx` |
| IconPicker                  | component เลือก Lucide icon พร้อมค้นหา + test + เพิ่มใน design system และ `design.md`                                                                                                        | `src/components/ui/IconPicker.tsx`, `test/IconPicker.test.tsx` (ใหม่), `design.md`                             |
| Invalidate budget           | category mutations ทั้ง 3 ตัว invalidate query `budget` เพิ่ม                                                                                                                                | `src/hooks/useCategory.ts`                                                                                     |
| Recurring form              | ปรับ `RecurringFormModal` (+95 บรรทัด)                                                                                                                                                       | `src/components/recurring/RecurringFormModal.tsx`                                                              |
| Pagination                  | ปรับ component + เพิ่ม test                                                                                                                                                                  | `src/components/ui/Pagination.tsx`, `test/Pagination.test.tsx`                                                 |
| Test เพิ่ม                  | `BudgetsPage.test.tsx`, `format.test.ts` (ใหม่), ขยาย `TransactionsPage.test.tsx` (+143 บรรทัด)                                                                                              | —                                                                                                              |
| Design doc                  | เพิ่มหัวข้อ Icon picker, กฎ navigation (LedgrIcon, UserRound placeholder), กฎจัดรูปแบบตัวเลข                                                                                                 | `design.md`                                                                                                    |

---

## 4. ข้อจำกัดปัจจุบัน (จากโค้ด)

### Frontend

| จุด                                                             | สถานะ                                                                                                                 | ที่มา                                                           |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Dashboard: ชุดตัวเลขสรุป, กราฟ cash flow, สัดส่วนรายจ่ายตามหมวด | ยังใช้ข้อมูลตัวอย่างที่ฝังในโค้ด (`periodData`, ค่าเป็นเดือน July 2026)                                               | `src/pages/DashboardPage.tsx:41`                                |
| Dashboard: ข้อความทักทาย                                        | ฝังเป็น "Good morning, Mina"                                                                                          | `src/pages/DashboardPage.tsx` (ใน `DashboardPage`)              |
| Dashboard: ปุ่มเลือกช่วงเวลา (monthly / yearly + ปุ่มวันที่)    | สลับเฉพาะข้อมูลตัวอย่าง ไม่ได้ส่ง parameter ไป API                                                                    | `src/pages/DashboardPage.tsx`                                   |
| Profile: ปุ่มบันทึก                                             | `onSubmit` ตั้งค่า state `saved` ในเครื่องเท่านั้น ไม่มี API สำหรับ update ใน `current-user.api.ts` (มีแค่ `GET /me`) | `src/pages/ProfilePage.tsx`, `src/api/user/current-user.api.ts` |
| Forgot password                                                 | หน้าไม่มีการเรียก API                                                                                                 | `src/pages/auth/ForgotPasswordPage.tsx`                         |
| Token                                                           | เก็บใน `localStorage`; 401 ล้าง token แต่ไม่มี refresh token flow ใน client                                           | `src/store/authStore.ts`, `src/api/client.ts`                   |
| สกุลเงิน                                                        | แสดงผลเป็น THB                                                                                                        | `src/pages/DashboardPage.tsx` ("THB")                           |

### Backend (จาก README ของ backend)

- Recurring transaction เป็นแม่แบบรายการประจำ มีการคำนวณวันครบกำหนดถัดไปและ endpoint `upcoming` แต่ยังไม่มี job ที่สร้างธุรกรรมจริงให้อัตโนมัติ
- รองรับสกุลเงินบาท (THB) เท่านั้น

### ความต่างระหว่างสองฝั่ง (เทียบเอกสาร backend กับโค้ด frontend)

- Backend ระบุว่า Summary มี "สัดส่วนรายจ่ายตามหมวดหมู่" และ "กระแสเงินสดสุทธิรายวัน" แต่ `src/api/summary/summary.api.ts` ของ frontend มี client เรียกเฉพาะ `/summary/transaction` เท่านั้น
- Backend ระบุว่ามีข้อมูลเหล่านี้ให้ แต่ Dashboard ฝั่ง frontend ในส่วนกราฟและสัดส่วนยังใช้ข้อมูลตัวอย่าง (ดูตารางด้านบน)

### เอกสารใน repo ที่ไม่ตรงกับโค้ดปัจจุบัน

- `README.md` เป็นข้อความเริ่มต้นของ TanStack Start template ไม่ได้อธิบายโปรเจกต์นี้ และยังอ้างถึง `src/routes/demo/` ซึ่งไม่มีอยู่
- `API_GAP_ANALYSIS.md` (แก้ล่าสุด 21 ก.ย.) ระบุว่า API ที่ใช้งานจริงมีแค่ category กับ transaction และกล่าวถึงหน้า Reports / Settings แต่ตอนนี้โค้ดมี client ของ budget, recurring, summary, `/me`, Google OAuth แล้ว และ Reports / Settings ถูกลบออกจาก working tree

---

## 5. Backend

# Finance App — Backend

REST API สำหรับแอปบันทึกรายรับ-รายจ่ายส่วนตัว รองรับการสมัครด้วยอีเมล (ยืนยัน OTP) และ Google Sign-In จัดการหมวดหมู่ รายการธุรกรรม งบประมาณรายเดือน รายการประจำ และสรุปภาพรวมรายเดือน

### Tech Stack

| ส่วน              | เทคโนโลยี                                                                               |
| ----------------- | --------------------------------------------------------------------------------------- |
| Framework         | NestJS 11, TypeScript                                                                   |
| Database          | PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`)                             |
| Auth              | JWT (Passport), bcrypt, Google OAuth 2.0 + PKCE                                         |
| Validation / Docs | class-validator, class-transformer, Swagger (ป้องกันด้วย Basic Auth)                    |
| Security          | helmet, CORS allow-list, rate limiting (`@nestjs/throttler`)                            |
| Email             | Resend                                                                                  |
| Test              | Jest (unit + e2e), supertest                                                            |
| DevOps            | Docker multi-stage, GitHub Actions, Google Cloud Run, Artifact Registry, Secret Manager |

### ฟีเจอร์หลัก

- **Authentication** — สมัครด้วยอีเมล/รหัสผ่านแล้วยืนยันด้วย OTP ทางอีเมล หรือเข้าสู่ระบบด้วย Google
- **Category** — หมวดหมู่แยกตามประเภท (รายรับ / รายจ่าย / การลงทุน) ระบบสร้างหมวดหมู่เริ่มต้นให้เมื่อยืนยันบัญชีสำเร็จ
- **Transaction** — CRUD รายการธุรกรรม พร้อม pagination และ filter
- **Budget** — ตั้งงบรายหมวดหมู่ต่อเดือน ดูยอดใช้จริงเทียบงบ และดูรายการที่ใช้เกินงบ
- **Recurring Transaction** — บันทึกรายจ่ายประจำรายเดือน และดูรายการที่จะครบกำหนดใน 30 วันข้างหน้า
- **Summary** — สรุปรายรับ/รายจ่าย/การลงทุนรายเดือน, สัดส่วนรายจ่ายตามหมวดหมู่, และกระแสเงินสดสุทธิรายวัน

### โครงสร้าง

แบ่งเป็น feature module ของ NestJS แต่ละโมดูลมี controller → service → Prisma และ DTO สำหรับ validate input

```
src/
├── modules/
│   ├── auth/        # signup, signin, Google OAuth, JWT strategy/guard
│   ├── otp/         # สร้าง/ส่ง/ส่งซ้ำ OTP, email template
│   ├── user/        # GET /me
│   ├── category/
│   ├── transaction/
│   ├── budget/      # budget service + budget-projection service
│   ├── recurring-transaction/
│   ├── summary/
│   └── prisma/
├── config/          # env validation, timezone (dayjs)
├── decorator/       # แปลงหน่วยเงิน baht → satang ตอนรับ input
└── utils/           # currency, period, OTP generator
```

ข้อมูลทุก entity ผูกกับ `userId` และทุก query กรองด้วย `userId` ของผู้ใช้ที่ล็อกอิน ผู้ใช้จึงเข้าถึงข้อมูลของคนอื่นไม่ได้

### วิธีการและการตัดสินใจทางเทคนิค

#### 1. เก็บเงินเป็นจำนวนเต็ม (satang)

ฐานข้อมูลเก็บยอดเงินเป็น `Int` หน่วยสตางค์ (฿123.45 = `12345`) เพื่อไม่ให้เกิดความคลาดเคลื่อนของ floating point API รับและส่งเป็นบาท โดยแปลงที่ขอบระบบด้วย decorator `@BahtToSatang()` ซึ่งตรวจด้วยว่าไม่ติดลบ ทศนิยมไม่เกิน 2 ตำแหน่ง และไม่เกินช่วงของ `Int4` ส่วนการคำนวณผลต่าง (เช่น รายรับ − รายจ่าย) ทำเป็นสตางค์ก่อนแล้วค่อยแปลงเป็นบาท

#### 2. งบประมาณแบบ projection ที่อัปเดตใน transaction เดียวกัน

ตาราง `Budget` เก็บ `spentAmount` ไว้ล่วงหน้า เพื่อให้หน้า budget ไม่ต้อง aggregate รายการธุรกรรมทุกครั้ง

- ทุกครั้งที่สร้าง / แก้ไข / ลบธุรกรรม `BudgetProjectionService` จะปรับ `spentAmount` ภายใน Prisma `$transaction` เดียวกับตัวธุรกรรม ข้อมูลทั้งสองจึงไม่หลุดจากกัน
- ใช้ `INSERT ... ON CONFLICT DO UPDATE` (raw SQL) เพื่อเพิ่ม/ลดยอดแบบ atomic ไม่ต้องอ่านก่อนเขียน
- ถ้าแก้ธุรกรรมแล้วหมวดหมู่หรือเดือนเปลี่ยน จะหักยอดจากที่เดิมและบวกเข้าที่ใหม่
- มี `reconcile` ที่คำนวณยอดจากรายการธุรกรรมจริงมาเขียนทับ ใช้ซ่อมข้อมูลหากยอดเพี้ยน

#### 3. เวลาและงวดรายเดือนใช้ timezone เดียว

กำหนดเขตเวลาผลิตภัณฑ์เป็น `Asia/Bangkok` และใช้ฟังก์ชันกลางสำหรับหาช่วงเดือน (`[start, end)`) ทำให้ตัดงวดรายเดือนตรงกันทุก endpoint (summary, budget, recurring) วันที่ที่มากกว่าจำนวนวันในเดือน เช่น วันที่ 31 ในเดือนกุมภาพันธ์ จะถูกปรับเป็นวันสุดท้ายของเดือน

#### 4. Google OAuth ที่ไม่ส่ง JWT ผ่าน URL

ใช้ Authorization Code Flow + PKCE (S256) และทำให้ปลอดภัยขึ้นดังนี้

- `state` และ `codeVerifier` เก็บในตาราง `GoogleOAuthAuthorization` พร้อมวันหมดอายุ และใช้ได้ครั้งเดียว
- หลัง Google callback ระบบไม่ส่ง JWT กลับไปใน redirect URL แต่ส่ง **handoff code** แบบใช้ครั้งเดียว (อายุ 5 นาที) ให้ frontend นำมาแลก JWT ผ่าน `POST /auth/google/exchange`
- `state` และ handoff code เก็บเป็น SHA-256 hash ในฐานข้อมูล
- การ consume ใช้ `updateManyAndReturn` พร้อมเงื่อนไข `consumedAt IS NULL` เพื่อกัน race condition เมื่อมีคำขอซ้อนกัน
- ตรวจ `id_token` กับ audience และต้องมี `email_verified`

#### 5. ยืนยันอีเมลด้วย OTP พร้อมกลไกกันการใช้งานผิดปกติ

- OTP อายุ 5 นาที ใส่ผิดได้ไม่เกิน 5 ครั้ง
- จำกัดจำนวนครั้งที่ขอ OTP ใหม่ ถ้าเกินบัญชีจะถูกระงับ (`BANNED`)
- การยืนยัน OTP, เปลี่ยนสถานะผู้ใช้ และสร้างหมวดหมู่เริ่มต้น ทำใน transaction เดียวกัน

#### 6. ความปลอดภัยระดับ API

- rate limit ทั้งระบบ 10 ครั้ง/นาที และเข้มกว่านั้นที่ endpoint ของ auth/OTP (3–5 ครั้ง/นาที)
- `ValidationPipe` แบบ global ปฏิเสธ input ที่ไม่ตรง DTO
- helmet, CORS แบบ allow-list จาก env, Swagger เข้าได้เฉพาะผู้ที่มี Basic Auth
- ตรวจ environment variable ที่จำเป็นตอนเริ่มระบบ ถ้าขาดหรือ URL ไม่ถูกต้องจะไม่ยอมสตาร์ท

#### 7. Database design

- Index ตามรูปแบบ query จริง เช่น `(userId, type, date)` สำหรับรายการธุรกรรม และ `(userId, categoryId, period)` สำหรับงบ
- หมวดหมู่ใช้ `onDelete: Restrict` กับธุรกรรม เพื่อไม่ให้ลบหมวดหมู่ที่ยังมีการใช้งาน ส่วนข้อมูลของผู้ใช้ใช้ `Cascade`
- unique `(userId, title, type)` กันหมวดหมู่ซ้ำ
- มี migration 21 ไฟล์ แสดงวิวัฒนาการของ schema ตั้งแต่เริ่มโปรเจกต์ (มี migration `harden_finance_schema` ที่เพิ่ม constraint ภายหลัง)

### Testing

- Unit test สำหรับ service และ controller ของแต่ละโมดูล (auth, budget, budget projection, category, recurring, summary, transaction, user)
- e2e test สำหรับ budget และ rate limiting
- รวมประมาณ 90 test cases (นับจาก `it(` ใน spec files)

### CI/CD และ Deployment

```
Pull Request → main : install → prisma generate → lint → test → build
Push → main         : build image (linux/amd64, tag ด้วย commit SHA)
                      → push Artifact Registry
                      → รัน migration ด้วย Cloud Run Job
                      → deploy Cloud Run service
```

- ยืนยันตัวตน GitHub → Google Cloud ด้วย Workload Identity Federation (OIDC) ไม่ต้องเก็บ service-account key
- ใช้ image เดียวกันรัน migration และ service และ tag ด้วย commit SHA เพื่อให้ rollback ได้ชัดเจน
- Migration รันก่อน deploy ถ้า migration ล้มเหลวจะไม่ deploy revision ใหม่
- แยก service account และ secret ของ migration ออกจาก application runtime
- Dockerfile แบบ multi-stage (builder / production deps / runner) บน `node:22-alpine`

---

## 6. การเชื่อมต่อ Frontend ↔ Backend

| หัวข้อ                | Frontend                                                                                                                            | Backend                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Auth Google           | เรียก `/auth/google/link` แล้วรับ `code` ที่ `/auth/google/callback` จึงแลก JWT ที่ `/auth/google/exchange` และลบ `code` ออกจาก URL | ไม่ส่ง JWT ใน redirect URL ใช้ handoff code ใช้ได้ครั้งเดียว อายุ 5 นาที |
| หน่วยเงิน             | ส่ง / รับเป็นบาท แล้วแสดงด้วย `formatNumber`                                                                                        | รับ / ส่งเป็นบาท เก็บเป็นสตางค์ (`Int`)                                  |
| งวดรายเดือน           | ส่งเดือนเป็น `YYYY-MM` (`period` ของ budget, `month` ของ summary)                                                                   | ตัดงวดตาม `Asia/Bangkok` ด้วยฟังก์ชันกลางเดียวกันทุก endpoint            |
| ยอดใช้จริงของงบ       | invalidate query `budget` ทุกครั้งที่แก้ transaction / category                                                                     | อัปเดต `spentAmount` ใน transaction เดียวกับตัวธุรกรรม                   |
| หมวดหมู่ที่ถูกใช้อยู่ | มี `deleteCategory` ใน `category.api.ts`                                                                                            | `onDelete: Restrict` ลบไม่ได้ถ้ายังมีธุรกรรม                             |

---

## 7. วิธีรัน (Frontend)

```bash
yarn install
yarn dev          # vite dev --port 3000
yarn typecheck    # tsc --noEmit
yarn test         # vitest run
yarn lint
yarn format:check
yarn build
```

ต้องตั้ง `VITE_API_BASE_URL` ใน environment ของ frontend ก่อนรัน ไม่เช่นนั้นแอปจะ throw `Missing VITE_API_BASE_URL` (`src/api/client.ts`)
