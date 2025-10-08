# Chatbot UI (React Native / Expo)

A single-screen mobile chatbot interface built with React Native + Expo. It simulates an LLM-like chat experience using only local fake data (no backend, no network calls). Now includes light/dark theme toggle with persisted preference.

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
- Expo SDK 51
- React Native 0.74
- TypeScript
- Jest for unit testing

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

## Potential Enhancements (Nice-to-haves)
- Persist chat history (AsyncStorage)
- Theming / dark-light toggle
- Message actions (copy, long-press menu)
- Rich markdown rendering for bot replies
- Better natural language variation / small Markov chain
- Accessibility pass (TalkBack / VoiceOver labels)

## Submission
Everything required to run and evaluate is contained locally. No API keys or network needed.

---
Enjoy exploring the chat UI! 🔍
