# Naukri.com Demo — Job Portal (Unofficial)

A high-fidelity **Naukri.com UI clone** built for demonstration purposes. It recreates the
look and feel of India's largest job portal — marketing landing, faceted job search, job
detail, mock auth, a "My Naukri" dashboard, profile editor, recruiter messages, and
simulated Naukri 360 AI tools.

> ⚠️ **Unofficial demo — not affiliated with Naukri.com or Info Edge (India) Ltd.**
> All data is dummy and stored locally in JSON files. No real services, databases, AI, or
> external integrations are used. Brand assets are included only for visual fidelity and
> remain the property of their respective owners.

## ✨ Features

- **Marketing landing** — signature hero job-search bar (keyword + experience + location),
  trending chips, top-companies bar, browse-by-category grid, Naukri 360 promo, testimonials.
- **Search Results Page (`/jobs`)** — left filter rail (Department, Work mode, Experience,
  Salary ₹ LPA, Location, Industry, Company type, Education, Posted), job cards with Save +
  Apply, sort, applied-filter chips, pagination, URL-synced filter state, mobile filter drawer.
- **Job Description (`/jobs/[slug]`)** — full JD with sticky apply rail, responsibilities,
  key skills, role details, about-company, and a similar-jobs rail. Apply writes an
  application and reflects status under **Applied**.
- **Mock auth** — login/register with a signed HTTP-only cookie (`jose` HMAC) + middleware
  protecting authenticated routes. Any credentials work in demo mode.
- **My Naukri dashboard** — profile summary with a completeness ring, recommended jobs,
  recruiter actions, profile-performance widgets with sparklines, application-status summary.
- **Profile editor** — 9 inline-editable sections (headline, key skills, employment,
  education, projects, certifications, IT skills, personal, career profile) via
  `react-hook-form` + `zod`, persisted to JSON.
- **Applied / Saved / Messages / Recommendations / Naukri 360 / Settings** — full set of
  job-seeker surfaces backed by local JSON APIs.

## 🧱 Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS with Naukri design tokens (CSS variables; primary `#1875E5`) |
| Components | shadcn/ui primitives + in-house components |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| State | React Context + `useReducer` (SRP filters, toasts, session) |
| Content | Markdown (gray-matter + react-markdown) |
| Auth | Mock session via HMAC-signed HTTP-only cookie (`jose`) + middleware |
| Persistence | Local JSON via route handlers (atomic temp-file + rename) |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

## 🚀 Getting started

**Prerequisites:** Node.js 18.18+ (Node 20+ recommended) and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

### Demo credentials

Any email and password work in demo mode. The login form is pre-filled with:

```
Email:    admin@example.com
Password: demo
```

You can also register a new account on `/register` — it is written to `data/users.json` and
auto-logs you in.

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run the Vitest suite |
| `npm run fetch-brand` | Re-fetch brand assets into `public/brand/` |

## 🗂️ Project structure

```
app/
  (marketing)/      # landing, about, employers (public)
  login/ register/  # auth pages
  jobs/             # SRP + JD (public)
  (app)/            # authenticated: dashboard, profile, applied, saved,
                    #   messages, recommendations, naukri-360, settings
  api/              # route handlers reading/writing local JSON
components/
  ui/               # shadcn primitives
  layout/ marketing/ jobs/ profile/ dashboard/ messages/ naukri360/ settings/ common/
lib/
  auth/ data/ types/ utils/ constants/
hooks/              # session, toast, profile-section
content/            # landing / legal / help markdown
data/               # JSON seed + runtime store
middleware.ts       # protects (app) routes
public/brand/       # logo + favicon assets
scripts/            # brand-asset fetch + seed generator
```

## 💾 How JSON persistence works

There is no database. Server route handlers in `app/api/*` read and write JSON files in
`data/` using `fs/promises`. Writes are **atomic**: the new content is written to a temp file
in the same directory and then renamed over the target so readers never see a partial file.
Seed data is committed; your interactions (applying, saving, profile edits, alerts) mutate
those files in place. To reset, restore the files with `git checkout data/` or re-run
`node scripts/generate-seed.mjs`.

## 🎨 Brand assets

Run `npm run fetch-brand` to (re)populate `public/brand/`. The script
(`scripts/fetch-brand-assets.sh`) first targets the **official Naukri CDN**
(`static.naukimg.com`) so it is reproducible in environments with open network access.

In restricted/CI environments the official CDN is typically unreachable, so the script falls
back to a **real, GitHub-hosted Naukri mark** for `logo-mark.svg` / `favicon.ico`. The
horizontal `logo.svg` / `logo-white.svg` wordmarks are brand-tokenized typographic renderings
(brand blue `#1875E5`) used as a fidelity fallback because the official wordmark SVG could not
be downloaded in this build environment. No logo is AI-generated or invented. See
`public/brand/brand-assets.json` for the manifest (filename, source, fetch date).

## ✅ Testing

```bash
npm run test
```

Covers: ₹ LPA / experience / "posted N days ago" formatters, auth token encode/decode
(round-trip + tamper rejection), the SRP filter reducer (apply/clear facets, salary &
experience predicates, pagination), the `JobCard` component (rating/skills/save+apply
states), `GlobalNav` active state, and the jobs (GET filter + pagination) and applications
(POST) API routes.

## ⚠️ Known limitations

- **Mock auth** — any credentials are accepted; the cookie is signed but not tied to a real
  identity provider.
- **JSON persistence** — single-file local storage; not concurrent-safe for heavy multi-user
  writes (fine for a demo).
- **Naukri 360** tools are simulated with sample content and timers (no real AI).
- **Brand wordmark** is a tokenized fallback where the official CDN is network-blocked (see
  Brand assets above).
```
