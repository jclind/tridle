# GLM-NOTES

Tests added on branch `glm/tests`, 2026-09-28. No application source was changed.

## Setup

- Dev dependencies added: `vitest` 5.0.2, `jsdom` 30.1.1, `@testing-library/react` 12.1.4.
  The latest @testing-library/react (16.x) requires React 18; this repo runs
  React 17, so the tests use 12.1.4, whose peer range allows it.
- `package.json` gained `"test": "vitest run"`.
- The vitest config lives in `vite.config.mjs` (jsdom environment, setup file).
  `npm run build` still works.
- `glm-test-setup.js` at the repo root gives jsdom the `#root` element that
  react-modal is pointed at, and cleans up renders and localStorage after each
  test.
- `src/client/firebase.js` and `src/client/analytics.js` are mocked at the
  module boundary in every file whose import graph reaches them. No test
  touches the network or a real Firebase.

## Tests added

60 passing tests in 9 files, plus 3 skipped suspected-bug tests in 1 file:

| File | Tests | Covers |
| --- | --- | --- |
| `src/util/glm-diff-days.test.js` | 6 | day counting, argument order, round vs truncate |
| `src/util/glm-daily-answer.test.jsx` | 7 | daily answer by date, uppercase, wrap at 427, midnight rollover, `getTridleNumber` |
| `src/util/glm-set-local-storage.test.js` | 8 | `setLocalStorage` shape, first win/loss, streak growth and reset, guess buckets |
| `src/Components/Tridle/glm-tridle.test.jsx` | 16 | letter colouring (eq/in/nin incl. duplicate-letter cases), win, loss after 8 guesses, invalid words, input rules, keyboard colours, save/resume/reset per day |
| `src/Components/TridleRow/glm-tridle-row.test.jsx` | 6 | tile letters and state classes, invalid-row flag |
| `src/Components/Tridle/KeyBoard/glm-keyboard.test.jsx` | 4 | key colours from guesses, eq never downgraded |
| `src/Components/EndGameModal/glm-end-game-modal.test.jsx` | 5 | win/loss text, guess vs guesses, clipboard share string |
| `src/Components/Navbar/GameStatsModal/glm-game-stats-modal.test.jsx` | 3 | stats numbers, distribution bar widths |
| `src/glm-app.test.jsx` | 5 | theme class from saved settings, default persistence, toggle, info and stats modals |
| `src/glm-suspected-bugs.test.jsx` | 3 (skipped) | the suspected bugs below |

Dates are pinned with fake timers. (GLM's version picked an instant 11 hours
into the answer's day and claimed that worked in any timezone. It failed 16
tests under Australia/Eucla and hid the getTridleNumber bug below. The suite
now runs in America/New_York; see the second review.)

## Final suite result

```
 Test Files  9 passed | 1 skipped (10)
      Tests  60 passed | 3 skipped (63)
```

## Not tested, and why

- `src/client/analytics.js` (`logGameEvent`) and `src/client/firebase.js`:
  thin Firestore glue whose only behavior is calling `updateDoc`/`addDoc` with
  the payload written on the same lines; a test would just re-assert the mock
  was called. Mocked instead, per the brief.
- `src/index.jsx`: bootstrap only (ReactDOM render plus scss imports).
- InfoModal, SettingsModal, ToggleTheme beyond what `glm-app.test.jsx` covers:
  static markup plus `getComputedStyle` lookups that return nothing in jsdom,
  so there is no logic to exercise. (GLM said the colorblind switch was
  covered through App's settings persistence. It isn't: no test clicks it.)
- Navbar's support modal: a "Content will go here" placeholder.
- SCSS and visual styling generally: jsdom computes no styles.
- A DST-crossing `diffDays` case. (GLM's reason, that it depends on the host
  timezone, is wrong: diffDays is plain epoch arithmetic. The second review
  added a 25-hour-day case for getTridleNumber instead.)

## Suspected bugs

Each has a skipped test in `src/glm-suspected-bugs.test.jsx`; unskipping it
shows the failure. Strongest first.

1. A win the day after a missed day sets `winStreak` to 0, not 1
   (`src/util/setLocalStorage.js:30-33`). The first-game branch (line 60)
   sets a fresh streak to 1, so a player who skips a day and then wins loses
   their streak entirely instead of restarting at 1, the way Wordle counts it.
2. The on-screen keyboard downgrades a yellow key to grey
   (`src/Components/Tridle/KeyBoard/KeyBoard.jsx:9-13`). Only `eq` is
   protected from overwrite, so a letter guessed `in` and then `nin` in a
   later guess shows grey even though it is in the answer.
3. The stats chart divides by zero when every game was lost
   (`src/Components/Navbar/GameStatsModal/GameStatsModal.jsx:123`). With
   `gamesWon` 0 each bar width is `(0/0)*100 = NaN`; the invalid inline style
   is dropped and the bars render at their CSS default instead of 0%.

## Checked by Claude, 2026-09-28

Suite re-run: 60 pass, 3 skipped. Outside tests, only package.json, the
lockfile, and the vitest block in vite.config.mjs changed. All 3 suspected
bugs fail when un-skipped, and the cited lines match: setLocalStorage.js:30-33
resets the streak to 0, KeyBoard.jsx:9-13 protects only `eq`, and
GameStatsModal.jsx:123 divides by totalWins.

## Second review by Claude, 2026-10-01

A review agent checked every test against intent, not current output. It
compared the game's colouring with a reference Wordle scorer over every
answer and every dictionary word and found no mismatch, so the
duplicate-letter tests were right.

Source fixes, each with a test that failed before:

- **The shared puzzle number ran one ahead from noon on (useDailyAnswer.js).**
  getTridleNumber counted from `new Date()` while the answer counts from local
  midnight, and diffDays rounds, so the share text said #4 on day 3 after
  12:00. Now both use local midnight. Tested at 00:00, 11:00, 12:30, 13:00,
  23:59 and on a 25-hour DST day.
- **Keyboard (KeyBoard.jsx)** keeps each letter's best state, eq over in over
  nin. A repeated letter in one guess (AHA vs CAT) used to grey a yellow key.
  Unguessed keys no longer get a literal `undefined` class.
- **Streak (setLocalStorage.js):** a win after a gap starts a streak of 1,
  not 0.
- **Stats bars (GameStatsModal.jsx):** with no wins every bar was NaN% wide,
  which drew them full width. Now 0%.

Test fixes:

- The suite runs in America/New_York (`test.env.TZ` in vite.config.mjs), the
  zone the start date is anchored to. Passes under Eucla, Tokyo and UTC shells.
- The midnight test steps to 1 ms before and exactly at midnight instead of
  jumping 25 hours.
- The 24-hours-ago streak test pins its clock, so DST can't flip it.
- Added: TAT vs CAT (nin/eq/eq), a win on the 8th guess, a 4th letter being
  ignored, every answer being in the dictionary (replaces a test that only
  checked 'cat' was there), exact `key btn` for an unguessed key.

Suite: 72 tests, 72 pass, 0 skipped. `npm run build` works.
