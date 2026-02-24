# Guide to Contributing to StudySpot

This document outlines our team norms, workflow, and contribution process for the Agile Development and DevOps course.

---

## Team Norms

- All project communication must happen in the public team Discord channel.
- Work must be tied to a GitHub Issue.
- No direct commits to `main`.
- If blocked for more than 30 minutes, post the issue and what you've tried.
- Keep pull requests small and focused.

---

## Roles

Each sprint has:
- **Product Owner (PO)** – prioritizes user stories and defines acceptance criteria.
- **Scrum Master (SM)** – maintains the board, runs sprint planning, and removes blockers.

Roles rotate every sprint.

All team members are also Developers.

---

## Git Workflow

We follow a feature branch workflow:

1. Create or assign a GitHub Issue.
2. Create a new branch from `main`:
   - `feature/<short-description>`
   - `fix/<short-description>`
   - `spike/<short-description>`
3. Commit changes with clear commit messages.
4. Open a Pull Request (PR).
5. At least one teammate must review the PR.
6. Merge only after approval.

No direct pushes to `main`.

---

## Labels

We use the following labels:

- `user story` – functional requirements
- `task` – implementation work
- `spike` – research or investigation
- `Sprint 0`, `Sprint 1`, etc. – sprint tagging

---

## Definition of Done

An issue is considered Done when:

- Acceptance criteria are met
- Code is committed to a feature branch
- A PR is opened and reviewed
- PR is merged into `main`
- The related card is moved to Done on the board

---

## Local Setup

Project setup instructions will be added once the application structure is finalized in early development.

---

## Testing

For Sprint 0, testing consists of:
- Verifying the application runs without crashing
- Confirming implemented endpoints/pages work as described in acceptance criteria

---

## Future Updates

This document will evolve as the project architecture and tooling become more defined.
