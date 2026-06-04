content = """# Meeting Minutes: Project Development & Design Sync

**Date:** June 05, 2026  
**Project:** Phish Hunt: Spot the Scam  
**Meeting No:** 02  

---

## 1. Attendees
*   **Tasnim** (Team Leader)
*   **Abiral** (Project Coordinator)
*   **Sebastian**
*   **Aakash**

---

## 2. Agenda Items
1.  **Storyboard Review:** Evaluating the initial game flow on Canva.
2.  **Scenario Selection:** Finalizing the 5 phishing scenarios for teenagers.
3.  **Documentation Update:** Reviewing the project management plan and daily checklists.

---

## 3. Discussion & Decisions

### **Storyboard & Design**
*   **Aakash** presented the initial UI concepts. The group agreed on a clean, modern aesthetic that appeals to a 14-16 age demographic.
*   **Decision:** The game will use a mobile-first interface design as it is the most common platform for the target audience.

### **Scenario Selection**
The group selected the following 5 phishing scenarios for development:
1.  **The Social Media "Blue Tick" Scam:** A fake DM offering account verification.
2.  **The Gaming Currency Giveaway:** A phishing link promising free in-game skins/currency.
3.  **The School Portal Alert:** A spoofed email claiming a "failed login attempt" on the student portal.
4.  **The Urgent Shipping Update:** A text-based scam regarding a missed package delivery.
5.  **The "Friend in Trouble" DM:** A compromised account asking for a "security code" sent to the user.

### **Project Coordination**
*   **Abiral** confirmed that the Project Management Plan is finalized.
*   The daily contribution log structure was approved to ensure individual accountability.

---

## 4. Action Items
| Task | Assigned To | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Finalize detailed Canva storyboard | Aakash / Abiral | 2026-06-10 | Pending |
| Draft technical logic for Scenario 1 & 2 | Sebastian | 2026-06-12 | Pending |
| Begin literature review for the Report | Tasnim | 2026-06-12 | Pending |
| Update GitHub repository with meeting notes | Abiral | 2026-06-06 | Pending |

---

## 5. Next Meeting
*   **Focus:** Technical walkthrough of the initial game prototype.
*   **Proposed Date:** June 12, 2026
"""

with open("Meeting_02_minutes.md", "w") as f:
    f.write(content)
