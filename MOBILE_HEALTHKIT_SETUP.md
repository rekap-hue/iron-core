# Mobile health setup (IRON CORE)

Capacitor + `@capgo/capacitor-health`: **Apple Health** on iOS and **Health Connect** on Android. The same JS helpers sync **active calories** (movement) and **weight** into the app.

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

`healthSyncAppleWeight` reads `weight` (body mass) for the **calendar day** and writes the **latest** sample into that day’s `w` in the roadmap (smart scales that sync to Apple Health / Health Connect). It does not overwrite a clearly manual edit (see `externalWeightSync` in code).

## 4) Manual test in app WebView console

```js
await window.healthAuthorizeAppleRead()
await window.healthSyncAppleMovement()
await window.healthSyncAppleWeight()
```

Expected result:

- A movement entry appears: `Auto pohyb (apple_health)`
- Only delta since last sync is added (no duplicate accumulation).
- Today’s weight in **Zápis / Progres** matches the latest body-mass sample in Health for today (after granting **Weight** read access).

## 5) Android (Health Connect)

1. **Min SDK:** the project uses `minSdkVersion = 26` (Health Connect requires Android 8+).
2. **Prepare + sync** (copies `web/` including `privacypolicy.html` for the Health Connect permission flow):

   ```bash
   npm run prepare:web
   npx cap sync android
   ```

3. Open in Android Studio: `npx cap open android` (or open the `android/` folder).
4. On **Android 13 and below**, the user may need the **Health Connect** app from Play Store if the system does not bundle it.
5. First sync opens the Health Connect permission screen — grant **Active calories burned** and **Weight** (read). The bundled `privacypolicy.html` in `web/` explains local-only use of data.

Auto-sync on Android uses source id `health_connect` in journal labels (`Auto pohyb (health_connect)`, `Auto váha (health_connect)`).

## 6) Important note

If you reinstall the app or clear local data, dedupe memory (`externalMoveSync` / `externalWeightSync`) resets for that local dataset.
