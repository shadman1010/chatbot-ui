# Chatbot UI (React Native / Expo)

APK LINK  https://expo.dev/artifacts/eas/gEC9sumbH8pxVAaKLEz7iF.apk

A single-screen mobile chatbot interface built with React Native + Expo. It simulates an LLM-like chat experience using only local fake data (no backend, no network calls). Now includes light/dark theme toggle with persisted preference.

## Brief compliance (Graphland)
- Project setup
  - React Native via Expo; Android buildable/publishable via EAS (APK/AAB).
  - iOS optional; omitted per instructions.
- Chat screen
  - Header title: Graphland Chat
  - Scrollable list, newest at bottom, auto-scrolls on new/streaming content
  - Input bar: multiline + Send
- Messages
  - Roles: user (right) and bot (left)
  - Bubbles with distinct backgrounds, rounded corners
  - Avatars/initials (U/B); timestamps shown under last message of a group
  - Grouping: consecutive same-role messages reduce repetition
- Typing experience
  - Typing indicator (~0.4–1.1s randomized)
  - Streaming/typewriter reply (character-by-character) while auto-scrolling
- Data & logic
  - 100% local fake data; simple keyword/random selection
  - Empty sends ignored
- Performance & polish
  - Keyboard-friendly layout (KeyboardAvoidingView + Android resize mode)
  - Clean component structure and readable code

Nice-to-haves included
- Dark/Light theme with persistence
- Retry on simulated failure (~10%) and Stop during streaming (bot-only)

Nice-to-haves deferred (can add if requested)
- Long-press message actions (copy)
- Retry on simulated failure / Stop generating
- Minimal markdown rendering in bot replies

## Features
- Chat screen with header title (Graphland Chat)
- Scrollable message list; newest at bottom; auto-scroll on new message
- Two roles: user and bot
- Bubble UI with grouping: consecutive messages from same role visually stack (reduced avatar/timestamp repetition)
- Typing indicator (three animated pulsing dots) before bot responds (0.4–1.1s random)
- Streaming bot reply (character-by-character) to mimic ChatGPT style
- Light/Dark theme toggle (header button) persisted via AsyncStorage
- Chat history persistence (AsyncStorage)
- Multiline input + Send button; send disabled when empty
- Simple rule/keyword + random based fake reply generator
- Light-weight grouping + streaming logic in a custom `useChat` hook
- Unit test for grouping logic (Jest + ts-jest)

## Tech
- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Jest for unit testing

## CI / EAS Build Setup
The repo includes a GitHub Actions workflow at `.github/workflows/eas-android-preview.yml` that builds a preview APK on pushes to `main` (excluding trivial file changes) or via manual dispatch.

Steps to enable it:
1. Create an EAS account (https://expo.dev) and run locally: `eas login` (if not already logged in).
2. Generate a non-expiring token: `eas token:create --non-interactive` (copy the output token).
3. In your GitHub repository settings: Settings → Secrets and variables → Actions → New repository secret.
  - Name: `EAS_TOKEN`
  - Value: (paste the token)
4. Push to `main` or trigger the workflow manually (Actions tab → Build Android Preview (APK) → Run workflow).
5. On success, the job summary will show an APK download URL.


## Getting Started

### 1. Install deps
```powershell
npm install
```

### 2. Start the dev server
```powershell
npx expo start
```
Then press `a` for Android emulator, `i` for iOS (if on macOS), or scan the QR code with Expo Go.

### 3. Run tests
```powershell
npm test
```

## Project Structure
```
App.tsx                # Root component wiring header, list, input
src/
  components/          # UI components (Header, MessageList, MessageBubble, TypingIndicator, InputBar)
  hooks/               # useChat hook (state, grouping, streaming logic)
  data/                # Fake data + generator
  theme/               # ThemeProvider + palettes + toggle
  __tests__/           # Jest tests
```

## How Fake Replies Work
`generateBotReply` checks for simple keywords (react, native, code, hello, hi, fun, fact) to select a category; otherwise falls back to generic prompts. A random text from that category is returned. Streaming is simulated at ~40 chars/sec.

## Architecture notes (short)
- State: local hook `useChat` manages messages, grouping, typing delay, and streaming timer. Messages persist to AsyncStorage.
- Grouping: `groupMessages` flags first/last in group; avatars and timestamps render on the last item of each group.
- UI: `Header`, `MessageList` (+ auto-scroll), `MessageBubble` (roles/avatars/timestamps), `TypingIndicator`, `InputBar`.
- Theme: `ThemeProvider` with persisted preference and role-based bubble colors.

## Potential Enhancements (Nice-to-haves)
- Message actions (copy, long-press menu)
- Rich markdown rendering for bot replies
- Better natural language variation / small Markov chain
- Accessibility / screen reader improvements

## Peer Dependency Note (React 19 + react-native-web)
React 19 is currently outside the declared peer range of `react-native-web@0.19.x` (which lists `react@^18`). This causes `npm ci` (which enforces peer deps strictly) to fail with an `ERESOLVE` conflict. Workarounds implemented here:

1. `.npmrc` contains `legacy-peer-deps=true` so local and CI installs ignore the peer mismatch.
2. The GitHub Actions workflow also sets `NPM_CONFIG_LEGACY_PEER_DEPS=true` for safety.

Alternative resolutions you could choose later:
- Downgrade to React 18 / Expo SDK combination that still uses React 18.
- Upgrade `react-native-web` when it releases a version whose peer range includes React 19.
- Use `--force` (not recommended) which may mask other issues.

Given the project is a self‑contained demo and functionality is verified, using legacy peer deps is an acceptable temporary trade‑off.

## App Assets
The `app.json` references these images in `./assets/`:
- `icon.png`
- `adaptive-icon.png`
- `splash.png`
- `favicon.png`

Placeholder files are included so EAS Build can hash and process them. 
- App icon / adaptive icon: 1024x1024 (foreground PNG with transparency for adaptive)
- Splash: Recommended at least your device max resolution (e.g., 1242x2436) with background color matching `splash.backgroundColor`.
- Favicon: 48x48 or 64x64 PNG.

If any of these files are missing EAS prebuild will fail (as you saw with the missing `adaptive-icon.png` error). Keep the filenames stable unless you also update `app.json`.

### Generated placeholders
A minimal 1x1 transparent PNG is written to each required file by the script `npm run generate:assets` (also auto-run via `prestart`). These are purely placeholders; replace them before distributing a production build.

## Submission
Everything required to run and evaluate is contained locally. No API keys or network needed.

Quick links
- Android preview APK: https://expo.dev/artifacts/eas/4KcbdyHWj3NpwTtXfNrMRu.apk (links expire ~30 days)
- Repository: https://github.com/shadman1010/chatbot-ui
- Recording (≤2 min): add a link here (e.g., Google Drive/Streamable)

---
Enjoy exploring the chat UI! 🔍
