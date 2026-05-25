# AITasker — Frontend

React + Vite frontend cho nền tảng AI Marketplace AITasker.

## Tech stack

| Thư viện | Mục đích |
|---|---|
| React 18 | UI framework |
| Vite | Build tool / dev server |
| React Router v6 | Client-side routing |
| TanStack Query | Server state (fetch, cache) |
| Zustand | Client state (auth, UI) |
| Axios | HTTP client |
| Tailwind CSS v3 | Styling |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| clsx | Conditional classnames |

## Folder structure

```
src/
├── assets/         # Images, icons
├── components/
│   ├── common/     # Shared business components (JobCard, ProposalCard...)
│   ├── layout/     # PublicLayout, ClientLayout, ExpertLayout, AdminLayout, Sidebar
│   └── ui/         # Design system: Button, Input, Badge, Card, Modal...
├── pages/
│   ├── auth/       # LoginPage, RegisterPage
│   ├── public/     # LandingPage, Marketplace, JobDetail, ExpertProfile
│   ├── client/     # Dashboard, PostJob, MyJobs, Messages, Payments, Settings
│   ├── expert/     # Dashboard, FindJobs, ProfileEdit, Earnings, Messages
│   └── admin/      # Users, Jobs, Disputes
├── routes/         # React Router config + auth guards
├── styles/         # Global styles bổ sung
```

## Cài đặt & chạy

```bash
# 1. Copy env
cp .env.example .env
# Điền VITE_API_BASE_URL vào .env

# 2. Cài dependencies
npm install

# 3. Chạy dev
npm run dev
# → http://localhost:3000
```

## Path aliases

```js
@/          → src/
@api/       → src/api/
@components/→ src/components/
@hooks/     → src/hooks/
@pages/     → src/pages/
@store/     → src/store/
@utils/     → src/utils/
@assets/    → src/assets/
```

## Env variables

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ANTHROPIC_API_KEY=
VITE_STRIPE_PUBLIC_KEY=
```
