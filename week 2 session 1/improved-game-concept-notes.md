content = """# Game Concept: Phish Hunt - Spot the Scam

## 1. Executive Summary
**Phish Hunt** is an interactive, narrative-driven educational game designed to build digital resilience in teenagers (ages 14–16). Instead of passive learning, players take on the role of a "Digital Guardian" who must audit a character's smartphone to identify and neutralize phishing threats before they cause data breaches.

## 2. Core Gameplay Mechanics
*   **The "Audit" Interface:** The game simulates a smartphone OS. Players navigate through simulated apps (Email, SMS, Social Media, Gaming Portals).
*   **Inspection Mode:** Players can click on specific elements of a message (sender address, links, tone of voice) to find "red flags."
*   **Decision Matrix:** For every suspicious item, the player must choose:
    *   *Ignore:* Risks the threat escalating.
    *   *Report/Block:* The correct action for malicious content.
    *   *Trust:* The correct action for legitimate, though perhaps urgent, communication.
*   **Feedback Loop:** Instant feedback is provided with a "Security Score" and a brief explanation of the technical indicator (e.g., "The URL was hidden using a Punycode attack").

## 3. Key Phishing Scenarios
1.  **Gaming Account Recovery:** A spoofed email from a popular gaming platform claiming a rare skin was gifted, requiring a login.
2.  **Social Media "Urgent Login":** A fake Instagram/TikTok notification about an unauthorized login attempt from a different country.
3.  **The "Free WiFi" Portal:** A simulated public WiFi login screen that asks for social media credentials.
4.  **SMS Package Scam:** A text message about a "held package" with a link to a fake tracking site.
5.  **Academic Portal Phish:** An email from the "School IT Department" requesting a password update for the student portal.

## 4. Technical Learning Objectives
*   **URL Literacy:** Recognizing subdomains vs. root domains.
*   **Sender Spoofing:** Checking the actual SMTP address behind a display name.
*   **Social Engineering:** Identifying "Urgency," "Fear," and "Authority" as psychological triggers.
*   **MFA Awareness:** Understanding that phishing often attempts to bypass or steal Multi-Factor Authentication codes.

## 5. Visual Aesthetic
*   **Modern & Relatable:** High-fidelity UI assets resembling current iOS/Android environments to ensure the skills transfer to real-world usage.
*   **Gamified Elements:** Progress bars, achievement badges for "Perfect Audits," and a leaderboard for the team.
"""

with open("GAME_CONCEPT.md", "w") as f:
    f.write(content)
