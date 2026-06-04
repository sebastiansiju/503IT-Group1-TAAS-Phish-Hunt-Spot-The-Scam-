# Bug Fix Log — Phish Hunt Final

## Project Information

**Project:** Phish Hunt — Spot the Scam!
**Date:** 05/28/2026

This document records bugs and issues identified during the development and testing of the game, along with the solutions applied by the development team.

---

# Bug Fix Records

| #  | Date       | Bug / Issue                                                            | Location                         | Fix Applied                                                                   | Fixed By        | Status  |
| -- | ---------- | ---------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- | --------------- | ------- |
| 1  | 05/28/2026 | Feedback only displayed “Correct” or “Wrong” without explanation       | `script.js` (feedback system)    | Added scam red-flag explanations and safe-message feedback system             | Sebastian Siju  | ✅ Fixed |
| 2  | 05/28/2026 | Scenarios appeared in the same order every game                        | `script.js` (startGame)          | Added Fisher–Yates shuffle algorithm and 23-scenario random pool              | Abiral Senchuri | ✅ Fixed |
| 3  | 05/28/2026 | Timer difficulty remained the same for all rounds                      | `script.js` (difficulty system)  | Added 4 difficulty levels with decreasing timers                              | Abiral Senchuri | ✅ Fixed |
| 4  | 05/28/2026 | Keyboard navigation stopped working after completing one question      | `script.js` (keyboard controls)  | Updated keyboard event handling so navigation resets correctly for each round | Sebastian Siju  | ✅ Fixed |
| 5  | 05/28/2026 | Landing page started the game when users tapped anywhere on the screen | `index.html` / `script.js`       | Restricted game start to intentional user actions only                        | Sebastian Siju  | ✅ Fixed |
| 6  | 05/28/2026 | Start interaction was unclear for users                                | `script.js` (start controls)     | Added “Press Space / Enter to Start” and double-tap support                   | Aakash Poudel   | ✅ Fixed |
| 7  | 05/28/2026 | Safe and Scam answer logic behaved incorrectly in some scenarios       | `script.js` (answer validation)  | Corrected answer validation logic and retested all scenarios                  | Abiral Senchuri | ✅ Fixed |
| 8  | 05/28/2026 | Empathy meter / leaderboard did not update correctly                   | `script.js` (leaderboard system) | Fixed score update logic and display refresh system                           | Sebastian Siju  | ✅ Fixed |
| 9  | 05/28/2026 | Mobile gameplay lacked user-friendly controls                          | `script.js` (touch controls)     | Added swipe-left and swipe-right controls                                     | Aakash Poudel   | ✅ Fixed |
| 10 | 05/28/2026 | Timer continued running after answers were selected                    | `script.js` (timer handling)     | Cleared timer interval after answer selection or timeout                      | Abiral Senchuri | ✅ Fixed |
| 11 | 05/28/2026 | Some scenario wording was too formal for teenagers                     | `script.js` (scenario content)   | Rewrote scenarios using simpler, age-appropriate language                     | Sebastian Siju  | ✅ Fixed |
| 12 | 05/28/2026 | Instructions modal remained open during gameplay                       | `script.js` (instructions modal) | Added close button and outside-click closing functionality                    | Aakash Poudel   | ✅ Fixed |
| 13 | 05/28/2026 | Landing page icon/logo was unclear and visually inconsistent           | `index.html` / `style.css`       | Updated and improved landing page icon and logo design                        | Aakash Poudel   | ✅ Fixed |

---

# How Bugs Were Identified

The development team identified bugs and gameplay issues using several testing methods:

* Repeated manual gameplay testing
* Browser testing across Chrome, Edge, and Firefox
* Mobile testing with swipe controls
* Keyboard-only accessibility testing
* Testing scoring, streak, and timer systems
* Reviewing scenario readability for the target age group
* Collecting feedback from external testers and classmates

---

# Bug Tracking Process

The team maintained a structured bug-fix process during development:

1. Identify and record the issue
2. Reproduce the bug consistently
3. Assign responsibility to a team member
4. Apply and test the fix
5. Retest after implementation
6. Mark the issue as resolved

This process helped ensure all major gameplay and UI issues were resolved before submission.

---

# Remaining Issues

At the time of final submission, no major gameplay or functionality bugs remained open.

Possible future improvements include:

* Adding sound effects and background music
* Additional scam scenarios
* More animations and visual effects
* Expanded accessibility options

These ideas are planned for potential future versions of the project.
