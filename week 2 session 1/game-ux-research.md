content = """# Game Overview: Age Test

## 1. Description
**Age Test** is an interactive personality and lifestyle quiz designed to determine a player's "mental age." Unlike traditional knowledge-based quizzes, this game focuses on self-expression, habits, and behavioral patterns to calculate whether a player's mindset aligns with their biological age.

## 2. Main Features
*   **Personality-Driven:** Questions focus on lifestyle, emotions, and daily routines.
*   **30-Question Database:** Covers diverse topics such as sleep cycles, social media usage, and school/work habits.
*   **Analysis Engine:** Uses a scoring system to map answers against behavioral patterns.
*   **Instant Feedback:** Provides a detailed result with humorous insights and age-related feedback.

## 3. Gameplay Mechanics
Players navigate through a series of creative questions with multiple-choice answers. Each selection contributes to a growing personality profile.
*   **Sample Questions:**
    *   *What time do you usually wake up?*
    *   *How do you feel when you get homework?*
    *   *What kind of music or movies do you enjoy?*

## 4. User Experience & Visuals
The game features a clean, user-friendly interface:
*   **Home Page:** Simple "Start Quiz" entry point.
*   **Interactive UI:** High-contrast buttons and progress indicators.
*   **Analysis Screen:** A transitionary period where the game "calculates" life choices.
*   **Result Screen:** Displays the final "Mental Age" (e.g., "25 years old - Peak teenager vibes").

## 5. Purpose
The core goal of **Age Test** is self-discovery and entertainment. It encourages social interaction by allowing players to compare their "mental ages" with friends and family in a relaxed, humorous setting.
"""

with open("AGE_TEST_OVERVIEW.md", "w") as f:
    f.write(content)
