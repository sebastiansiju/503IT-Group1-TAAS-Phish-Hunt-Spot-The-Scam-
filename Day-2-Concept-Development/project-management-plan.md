content = """# Project Management Plan: Phish Hunt - Spot the Scam

## 1. Project Overview
*   **Project Name:** Phish Hunt: Spot the Scam
*   **Objective:** To develop an interactive educational game designed to train teenagers (ages 14-16) on identifying and avoiding phishing attacks.
*   **Key Deliverables:** 
    *   Interactive Game Prototype
    *   Visual Storyboard (Canva)
    *   Comprehensive Project Report (Markdown)
    *   Daily Contribution Logs & Checklists

## 2. Team Structure & Roles
| Name | Role | Primary Responsibilities |
| :--- | :--- | :--- |
| **Tasnim** | Team Leader | Overall project management, final deliverable approval, and lead on the formal report. |
| **Abiral** | Project Coordinator | Storyboard guidance, daily checklist management, Markdown documentation, and group representation. |
| **Sebastian** | Technical Lead | Game logic development, technical implementation, and cybersecurity scenario accuracy. |
| **Aakash** | Design Lead | UI/UX design, visual asset creation (logos, templates), and Canva management. |

## 3. Development Phases (Timeline)

### Phase 1: Initiation & Research (Current)
*   Define project scope and target audience requirements.
*   Research current phishing trends relevant to youth (social media, gaming, school portals).

### Phase 2: Design & Storyboarding
*   Draft the game flow on Canva.
*   Create "Safe" vs "Malicious" content templates.
*   Assign specific phishing scenarios (e.g., "Urgent Password Reset," "Fake Prize Notification").

### Phase 3: Implementation & Documentation
*   Develop game mechanics.
*   **Abiral** to maintain the `CONTRIBUTIONS.md` and daily project checklists.
*   **Tasnim** to structure the project report.

### Phase 4: Quality Assurance & Submission
*   Internal testing of game scenarios.
*   Final review of the Markdown documentation for SEO and professional formatting.
*   Final submission.

## 4. Communication & Tools
*   **Version Control:** GitHub (Managed by Abiral & Sebastian).
*   **Design:** Canva (Managed by Aakash).
*   **Documentation:** Markdown / VS Code.
*   **Meetings:** Regular syncs to update checklists.

## 5. Risk Management
| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| Scope Creep | High | Limit scenarios to 5 distinct, high-quality examples. |
| Technical Integration | Medium | Use simple, modular logic for the game prototype. |
| Documentation Lag | Low | Daily checklist updates to ensure no data is lost. |
"""

with open("PROJECTMANAGEMENT.md", "w") as f:
    f.write(content)
