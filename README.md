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

The signed-in account on a device is stored locally for convenience. Shared
business data (bookings, users, support messages, service cities) can be stored
in Firebase Firestore so all phones see the same updates.

## Firebase shared data setup

This app now supports shared cloud data with Firebase Firestore so multiple
phones can see the same bookings, registered users, support messages, and
service cities.

1. Create a Firebase project in the Firebase console.
2. Enable Firestore Database (start in test mode while developing).
3. Enable Firebase Authentication and turn on the Email/Password sign-in provider.
4. In Authentication templates, verify your sender email template settings.
5. Create a Web app inside your Firebase project and copy its config values.
6. Copy `.env.example` to `.env` and fill in all `EXPO_PUBLIC_FIREBASE_*` keys.
7. Restart Expo with a clean cache:

```bash
npm start -- --clear
```

For an EAS/Play Store build, create the same variables in the EAS `production`
environment. Do not commit `.env` or put passwords in `app.json`:

```bash
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_API_KEY --value "your-value"
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "your-value"
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "your-value"
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "your-value"
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "your-value"
eas env:create --environment production --name EXPO_PUBLIC_FIREBASE_APP_ID --value "your-value"
eas build --platform android --profile production
```

Publish `firestore.rules` in the Firebase console or with the Firebase CLI.
The current app uses one shared Firestore document, so these rules require
Firebase Authentication but do not yet provide per-user privacy. Migrate
bookings, profiles, and support messages to separate documents before treating
the app as production-ready for sensitive data.

If Firebase config is missing, the app automatically falls back to local-only
storage on each phone.

With Firebase config enabled, user registration sends a free verification email
link. Users must verify their email before login is allowed.

## Production readiness

Set `EXPO_PUBLIC_ADMIN_EMAIL` to the verified Firebase Authentication email used
for the admin account, both in `.env` for local testing and in the EAS
`production` environment. The app has no built-in demo administrator password.

Do not publish the current shared Firestore data model: any authenticated user
can read and modify the shared document containing account profiles, bookings,
support messages, ID-card images, and payment receipts. Production release
requires moving authorization to trusted server-side code and isolating access
to each user's data. Do not deploy the current `firestore.rules` as production
rules. The Firebase Admin SDK key must never be included in the app or source
control; if it has been shared or committed, revoke and replace it immediately.
