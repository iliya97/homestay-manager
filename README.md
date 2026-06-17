# 🏠 Homestay Manager

A simple, mobile-first booking tracker built for Airbnb and homestay owners. Born out of a real need — my father was managing his Airbnb bookings manually on paper. This app gives him a clean interface to record and track guest bookings from his phone.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**[Live Demo →](https://homestay-manager.netlify.app/)**

---

## Features

- Add guest bookings with name, check-in/check-out dates, and phone number
- Automatic status tagging — Upcoming, Active now, or Past
- Overlap detection to prevent double bookings
- Filter bookings by status
- Stats overview showing total, active, and upcoming bookings
- Cloud-synced via Supabase — works across devices
- Installable as a PWA — add to home screen on any phone

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Hosting | Netlify |
| PWA | vite-plugin-pwa |

## Project Structure

```
homestay-manager/
├── src/
│   ├── components/
│   │   ├── BookingForm.jsx     # Add new booking form with validation
│   │   ├── BookingList.jsx     # Filterable booking list
│   │   ├── BookingCard.jsx     # Individual booking row
│   │   └── StatsBar.jsx        # Summary stats at the top
│   ├── hooks/
│   │   └── useBookings.js      # Custom hook for all Supabase operations
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   └── utils.js            # Date helpers, status logic
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── .env.example
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/homestay-manager.git
cd homestay-manager
npm install
```

### 2. Set up Supabase

In your Supabase project, run this SQL in the SQL Editor:

```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  guest_name text not null,
  check_in date not null,
  check_out date not null,
  phone text not null,
  created_at timestamptz default now()
);

alter table bookings enable row level security;

create policy "Allow all" on bookings
  for all using (true) with check (true);
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:

```
VITE_SUPABASE_URL=https://jpqrnirzgewmgrkoyvag.supabase.co/rest/v1/
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Deployment

This project is deployed on Netlify via GitHub integration.

1. Push your repo to GitHub
2. Connect the repo on [Netlify](https://netlify.com) — Import from GitHub
3. Set build command to `npm run build` and publish directory to `dist`
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Site Settings → Environment Variables
5. Deploy — every future `git push` triggers an auto-deploy

## Installing on Mobile (PWA)

**iPhone:** Open the live URL in Safari → tap Share → Add to Home Screen

**Android:** Open in Chrome → tap the 3-dot menu → Add to Home Screen

The app icon will appear on the home screen and open in fullscreen like a native app.

## Motivation

My father owns a homestay and was tracking bookings manually in a calendar. I built this as a practical tool for him — simple enough for a non-technical user on a phone, while being a real project with a proper stack worth adding to a portfolio.