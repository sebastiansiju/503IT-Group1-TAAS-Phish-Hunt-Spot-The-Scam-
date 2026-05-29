# 503IT_GROUP_1_CYBERSECURITY_KID_GAME-

Group Name: Team TaAs

Group Members:

Tasnim Tasnim = Group Leader

Aakash Poudel = Research Lead/ Evidence Manager

Abiral Senchuri = Game Design Lead 

Sebastian Siju = Project Coordinator/ Github Lead

Game Title: Phish Hunt:Spot the Scam
Our target Audience: 14-16 Age group

Game Instructions/ How to play
- Read each email or message carefully.
- Identify whether the message is SAFE or a SCAM.
- Click the correct option before the timer ends.
- Each question has 10 seconds to answer.
- You will earn 5 points for every correct answer.
- If you choose the wrong answer, a message saying “Quite enough, try again” will appear.
- If no option is selected before time runs out, the question will be skipped automatically.
- Complete all 20 scenarios to finish the game.
- Your final score will be displayed at the end of the game.

UI/UX Points for Age Group 14–16
-Colorful and attractive interface design
-Simple and easy-to-understand layout
-Interactive gameplay suitable for teenagers
-Large buttons for SAFE and SCAM options
-Quick popup instructions for beginners
-10-second timer to keep players engaged
-Score system to motivate users
-Friendly and educational game experience
-Smooth navigation between screens
-Easy readability with clear fonts and spacing
-Designed to improve phishing awareness in teenagers  

# Phish Hunt — Spot the Scam

A shorter standalone version of the Phish Hunt cyber-safety game. Players are given 3 scenarios and must decide if each one is **SAFE** or a **SCAM** within 10 seconds.

## How to play
1. Open `index.html` in any web browser
2. Click **Start Fishing!**
3. Read each scenario carefully
4. Tap **SAFE** or **SCAM** before the timer runs out
5. Earn 5 points per correct answer (15 possible)

## Files
- `index.html` — page structure
- `style.css` — styling and animations
- `script.js` — game logic and scenarios

## Topics covered
- QR code ("quishing") scams
- Legitimate security notifications
- In-game / gaming account theft scams

# Accessibility Design Note — Phish Hunt: Spot the Scam

**Target age group:** 14–16 year olds
**Standard followed:** WCAG 2.1 Level AA

---

## 1. Readable text

- Base font size increased from 16px to **17px** with a **1.6 line-height** for easier reading.
- Scenario message text is **18px** (well above the 16px minimum recommended for younger readers).
- Final score and headings use bold weights and large sizes (36px–64px).
- System fonts (`-apple-system`, `Segoe UI`, `Roboto`) used so text renders sharp on every device, no slow web-font load.

## 2. Clear buttons

- SAFE and SCAM buttons are **large (32px padding, 24px text)** so they're easy to tap on phones.
- Each button has both an **icon AND a word** (✓ SAFE / ⚠ SCAM) — never icon-only, so meaning is never lost.
- `aria-label` added to every button so screen readers announce *"Mark this message as Safe"* rather than just *"Safe"*.
- **Visible yellow focus ring** appears when tabbing with the keyboard, so keyboard-only users can always see where they are.
- A **skip link** at the top of the page lets screen reader users jump straight to the game.

## 3. Suitable colour contrast (WCAG AA = 4.5:1 minimum)

Contrast was measured on every text/background pair. Results:

| Element | Ratio | WCAG AA |
|---|---|---|
| Scenario message text | 9.86 : 1 | ✓ Pass |
| Scenario title | 14.05 : 1 | ✓ Pass |
| Header text on blue | 5.17 : 1 | ✓ Pass |
| Lesson box text | 7.28 : 1 | ✓ Pass |
| Body text on white | 7.56 : 1 | ✓ Pass |
| Final score (fixed) | 8.59 : 1 | ✓ Pass *(was 4.24 — darkened from `#2563eb` to `#1e3a8a`)* |
| Subtitle (fixed) | 7.56 : 1 | ✓ Pass *(was 4.83 — darkened from `#6b7280` to `#4b5563`)* |

Colour is **never the only indicator**: SAFE is green ✓, SCAM is red ⚠, but both also have words and icons, so colour-blind players can still play.

## 4. Reduced motion

The game has bouncing stars, pulsing dots, and animated points pop-ups. For players who get dizzy or have vestibular conditions, the CSS includes a `@media (prefers-reduced-motion: reduce)` rule that **switches off all animations** if the user has that setting enabled in their device.

## 5. Age-appropriate language (14–16)

Scenario text uses everyday words for teen players:

- *"Failure to pay within 10 minutes will result in a £80 fine"* → *"If you don't pay in 10 minutes you will get a £80 fine"*
- *"A new sign-in to your GitHub account was made"* → *"Someone signed into your GitHub account"*
- Red flags now begin with friendly explanations like *"Scammers stick fake QR codes over real ones — this is called quishing"* instead of dropping jargon.
- Examples chosen on purpose for this age: **GitHub, Roblox, Fortnite, QR codes** — things teens actually use, not retirement-age scams like fake lottery letters.
- Encouraging messages between rounds (*"🚀 Great start!"*, *"🔥 Triple streak!"*) match the energy of a teen game without being childish.

## 6. Screen-reader support

- `<main role="main">` wraps the game so screen readers can find the content.
- `aria-live="polite"` on the scenario box → new questions read out automatically.
- `aria-live="assertive"` on the result header → "Correct!" or "Not Quite!" announced straight away.
- Emoji decorations marked `aria-hidden="true"` so screen readers don't read "fish emoji, anchor emoji" before every heading.

---

## Testing evidence

| Test | Method | Result |
|---|---|---|
| Keyboard-only play | Tabbed through every button using only the keyboard | ✓ All buttons reachable, focus ring visible |
| Mobile readability | Opened on a 380px-wide phone screen | ✓ Text readable, buttons full-width |
| Colour contrast | Measured all pairs with WCAG ratio formula | ✓ All passing AA, most passing AAA |
| Reduced motion | Enabled "Reduce motion" in OS settings | ✓ Animations disabled, game still fully playable |
| Language check | Read scenarios aloud as a 14-year-old | ✓ No words a teen wouldn't know |


