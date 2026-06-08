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
| `/` | Home — pick kiosk or admin |
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
- Dashboard with dine-in / call-in entry points
- Waitlist sidebar with search and party-size filters
- Notify, Check In, Seat, and Cancel actions
- Visual floor plan with table timers
- Add guests manually from staff side

**Notifications (VoceChat)**
- Messages go to your staff VoceChat inbox until SMS is configured
- All messages go to VoceChat user `437225` — set `VOCECHAT_BOT_API_KEY` in `.env.local` (see `.env.example`)
- Test: `curl -X POST http://localhost:3000/api/notifications/test`

## Data

SQLite database stored at `data/openwaitlist.db`. Floor plan tables are seeded on first run; the waitlist starts empty.

## Tech stack

- Next.js 16 (App Router)
- Tailwind CSS
- SQLite (better-sqlite3)
