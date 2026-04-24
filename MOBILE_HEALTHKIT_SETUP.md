# iOS HealthKit Setup (IRON CORE)

This project now includes Capacitor and a Health bridge for movement kcal sync.

## 1) One-time setup

```bash
npm install
npm run cap:sync
```

## 2) Open iOS project

```bash
npm run cap:open:ios
```

Then in Xcode:

1. Select target `App`.
2. Open **Signing & Capabilities**.
3. Click **+ Capability** and add **HealthKit**.
4. Build and run on real iPhone (HealthKit is not fully testable on simulator).

## 3) What is already implemented in web app

- `window.healthAuthorizeAppleRead()`
- `window.healthSyncAppleMovement(dayKey?, source?)`
- `window.healthAutoSyncTodayOnce()` (called in `render()`)
- `window.syncExternalMovementKcal(...)` with dedupe by daily cumulative total

`healthSyncAppleMovement` reads `calories` samples from HealthKit for the day and logs the delta into `zapsat pohyb`.

## 4) Manual test in app WebView console

```js
await window.healthAuthorizeAppleRead()
await window.healthSyncAppleMovement()
```

Expected result:

- A movement entry appears: `Auto pohyb (apple_health)`
- Only delta since last sync is added (no duplicate accumulation).

## 5) Important note

If you reinstall the app or clear local data, dedupe memory (`externalMoveSync`) resets for that local dataset.
