# Testing Record — Phish Hunt Final

## Project Information

**Project:** Phish Hunt — Spot the Scam!
**Tested By:** Sebastian Siju, Aakash Poudel, Abiral Senchuri, Aakash Poudel, Yoseph Tamang, Krishna Shah, Roshan
**Testing Date(s):** 05/28/2026

---

# 1. Testing Methods Used

The team used multiple testing methods to ensure the game was stable, functional, accessible, and responsive across devices and browsers.

### Functional Testing

Tested all gameplay systems and features to ensure they worked correctly.

### Device Testing

Tested the game on:

* Laptop/Desktop
* Mobile phone

### Browser Testing

Tested functionality and layout on:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox

### Control Testing

Tested different control methods:

* Mouse controls
* Keyboard controls
* Swipe/touch controls

### Accessibility Testing

Checked:

* Keyboard-only gameplay
* Text readability
* Colour contrast
* User-friendly language for ages 14–16

### User Feedback Testing

Additional testers outside the development team played the game and provided gameplay feedback and usability suggestions.

---

# 2. Functional Test Results

| #  | Feature Tested         | Expected Result                          | Actual Result    | Status |
| -- | ---------------------- | ---------------------------------------- | ---------------- | ------ |
| 1  | Start Button           | Game starts correctly                    | Worked correctly | ✅ Pass |
| 2  | Instructions Modal     | Instructions display properly            | Worked correctly | ✅ Pass |
| 3  | Random Scenario System | Scenarios appear in random order         | Worked correctly | ✅ Pass |
| 4  | Difficulty Timer       | Timer changes based on level             | Worked correctly | ✅ Pass |
| 5  | Level-Up Notifications | Level-up message appears                 | Worked correctly | ✅ Pass |
| 6  | Correct Answer System  | Score increases correctly                | Worked correctly | ✅ Pass |
| 7  | Wrong Answer System    | Incorrect feedback appears               | Worked correctly | ✅ Pass |
| 8  | Educational Feedback   | Scam explanations display                | Worked correctly | ✅ Pass |
| 9  | QR-Code Challenges     | QR scenarios function properly           | Worked correctly | ✅ Pass |
| 10 | Streak System          | Streak count updates correctly           | Worked correctly | ✅ Pass |
| 11 | Streak Reset           | Streak resets after incorrect answer     | Worked correctly | ✅ Pass |
| 12 | Timer Timeout          | Timeout moves to feedback screen         | Worked correctly | ✅ Pass |
| 13 | Accuracy Percentage    | Accuracy displays correctly              | Worked correctly | ✅ Pass |
| 14 | Best Streak Record     | Best streak saves correctly              | Worked correctly | ✅ Pass |
| 15 | High Score System      | New high score displays correctly        | Worked correctly | ✅ Pass |
| 16 | Leaderboard System     | Top scores save correctly                | Worked correctly | ✅ Pass |
| 17 | Replay Validation      | Player prompted to save name             | Worked correctly | ✅ Pass |
| 18 | Keyboard Controls      | Arrow keys and Enter function properly   | Worked correctly | ✅ Pass |
| 19 | Swipe Controls         | Mobile swipe controls function correctly | Worked correctly | ✅ Pass |

---

# 3. Device and Browser Testing

| Device / Browser | Layout Result                      | Controls Result                 | Status |
| ---------------- | ---------------------------------- | ------------------------------- | ------ |
| Laptop — Chrome  | Layout displayed correctly         | Mouse and keyboard worked       | ✅ Pass |
| Laptop — Edge    | Layout displayed correctly         | Mouse and keyboard worked       | ✅ Pass |
| Laptop — Firefox | Layout displayed correctly         | Mouse and keyboard worked       | ✅ Pass |
| Mobile Phone     | Responsive layout worked correctly | Swipe and touch controls worked | ✅ Pass |

---

# 4. Accessibility Testing

| Accessibility Test       | Method Used                            | Result                            |
| ------------------------ | -------------------------------------- | --------------------------------- |
| Keyboard-only Gameplay   | Used only arrow keys and Enter         | Fully playable without mouse ✅    |
| Text Readability         | Checked text size on devices           | Clear and readable ✅              |
| Colour Contrast          | Checked visibility of text and buttons | Strong contrast and readability ✅ |
| Age-Appropriate Language | Reviewed wording and scenarios         | Suitable for ages 14–16 ✅         |

---

# 5. User Feedback Testing

The following users tested the final version of the game and provided feedback:

| Tester        | Feedback                                                             |
| ------------- | -------------------------------------------------------------------- |
| Aakash Poudel | The game was interactive and easy to understand.                     |
| Yoseph Tamang | QR-code phishing challenges felt realistic and educational.          |
| Krishna Shah  | Difficulty levels made the gameplay more engaging.                   |
| Roshan        | The leaderboard and streak system made the game competitive and fun. |

### Suggested Improvements

* Add sound effects and background music
* Include more phishing scenarios
* Add more animations and visual effects

### Team Response

The team recorded all feedback and identified these suggestions as future improvements for the next version of the game.

---

# 6. Testing Summary

All 19 functional tests were completed successfully. The game worked correctly across multiple browsers and devices while supporting mouse, keyboard, and mobile controls.

Testing also confirmed that:

* Gameplay systems were stable
* Educational feedback functioned correctly
* Accessibility improvements worked effectively
* Leaderboard and scoring systems operated properly

All major bugs identified during testing were recorded and resolved in `bug-fix-log.md`.

---

# Final Result

The final game build is stable, fully playable, accessible, and ready for presentation and submission.
