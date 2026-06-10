# OpenWaitlist

Open-source restaurant waitlist management — inspired by Chowbus. Runs locally as a web app with a **customer kiosk** and **staff admin** interface.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/kiosk` | Customer landing screen |
| `/kiosk/join` | Live queue + join form |
| `/admin` | Redirects to waitlist management |
| `/admin/waitlist` | Staff waitlist management |

## Features

**Customer kiosk**
- Tap-to-start landing screen
- Live waitlist display (ticket number, name, party size)
- Touch-friendly join form with numeric keypad
- Confirmation screen with auto-return countdown

**Staff admin**
- Waitlist sidebar with search and party-size filters
- Notify, Check In, Seat, and Cancel actions
- Add guests manually from staff side

**Notifications**
- **Customer SMS (Telnyx):** queue confirmation + table-ready texts go to the guest's phone
- **Staff alerts (VoceChat):** check-in, seated, and cancel updates go to VoceChat user `437225`
- Set `TELNYX_API_KEY` and `TELNYX_FROM_NUMBER` in `.env.local` (see `.env.example`)
- Test SMS: set `TELNYX_TEST_TO`, then `curl -X POST http://localhost:3000/api/notifications/test`

## Deploy on Vercel (recommended for production)

Vercel runs the **full app** — API, database, Telnyx SMS, and VoceChat staff alerts.

### 1. Create a Turso database (free)

Turso is serverless SQLite. Local file SQLite does not persist on Vercel.

```bash
# Install Turso CLI: https://docs.turso.tech/cli
turso db create openwaitlist
turso db show openwaitlist --url        # copy URL
turso db tokens create openwaitlist     # copy token
```

### 2. Deploy to Vercel

```bash
npm i -g vercel
cd openwaitlist
vercel
```

Or connect **https://github.com/Privoce/OpenWaitlist** in the [Vercel dashboard](https://vercel.com/new).

### 3. Add environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|----------|-------|
| `TURSO_DATABASE_URL` | `libsql://…` from Turso |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `TELNYX_API_KEY` | Your Telnyx API key |
| `TELNYX_FROM_NUMBER` | Your Telnyx number in E.164 (e.g. `+15551234567`) |
| `VOCECHAT_BOT_API_KEY` | Your VoceChat bot key |
| `VOCECHAT_BASE_URL` | `https://dev.voce.chat` (optional) |

Redeploy after adding env vars. Your app will be at `https://your-project.vercel.app`.

### Local vs Vercel

| | Local `npm run dev` | Vercel |
|--|--|--|
| Database | SQLite file in `data/` | Turso (cloud) |
| Telnyx SMS | `.env.local` | Vercel env vars |
| VoceChat | `.env.local` | Vercel env vars |
| GitHub Pages | — | UI demo only (localStorage) |

## GitHub Pages

Landing page + interactive demo: https://openwaitlist.privoce.com (after Pages is enabled)

### First-time setup (required)

GitHub Pages must be enabled once or deploys will fail with a 404:

1. Open [Settings → Pages](https://github.com/Privoce/OpenWaitlist/settings/pages)
2. Set **Source** to **GitHub Actions**
3. Re-run **Actions → Deploy GitHub Pages** (or push to `main`)

See [.github/ENABLE-PAGES.md](.github/ENABLE-PAGES.md) for details and custom domain setup.

Future custom domain: **openwaitlist.privoce.com** (CNAME file included — add the domain in GitHub Pages settings, then point DNS to GitHub).

The GitHub Pages build runs in the browser with localStorage (no server). SMS and VoceChat are not available on Pages — use the [Vercel deployment](https://openwaitlist.vercel.app) for full features.

## Data

- **Local:** SQLite file at `data/openwaitlist.db`
- **Vercel:** Turso cloud database (when `TURSO_*` env vars are set)

## Tech stack

- Next.js 16 (App Router)
- Tailwind CSS
- SQLite locally / Turso on Vercel
