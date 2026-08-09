# Cleaner Service App

A cross-platform Expo app for booking home cleaning services on Android and iPhone.

## Run locally

```bash
npm install
npm start
```

Then scan the QR code with Expo Go:

- Android: use the Expo Go app.
- iPhone: use the Camera app or Expo Go.

If you see a large JSON object in the browser, you opened Expo's manifest URL.
For a phone, scan the QR code from the terminal with Expo Go. For a browser
preview, run:

```bash
npm run web
```

## What is included

- Register and login screens.
- Admin dashboard for bookings and worker availability.
- Service selection for home, deep, and move in/out cleaning.
- Cleaning worker dashboard with availability by selected time slot.
- Booking details for rooms, address, extras, and time slot.
- Live price estimate.
- Mobile-first layout that works on Android and iOS from the same codebase.

The current login is stored only while the app is open. Add a backend such as
Firebase, Supabase, or your own API when you need real saved user accounts.

## Admin login

Use this demo admin account:

```text
admin@cleaner.app
admin123
```

The admin dashboard can view bookings, change booking status, and toggle worker
availability by time slot.
