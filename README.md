# StudySpot

![CI](https://github.com/agile-students-spring2026/final-studyspot/actions/workflows/ci.yml/badge.svg)

## Live Application

**[http://159.223.160.19](http://159.223.160.19)**

---

## Product Vision Statement

**Yelp for campus study spaces.**
Helping students discover the right place to study — without wasting time wandering campus.

During peak exam periods, students often struggle to find available seats with the right amenities, while many great spaces go unnoticed. StudySpot is a mobile-first web app that enables students to quickly discover and evaluate campus study spaces through searchable listings, filters, and peer reviews.

---

## Description

StudySpot provides structured, searchable information about campus study spaces to help students make faster and more informed decisions.

Key features include:

- **Browse Study Spaces** – Searchable list or map view of campus locations with photos, amenities, hours, and descriptions.
- **Detailed Information** – View outlets, WiFi quality, seating types, noise levels, accessibility information, and best times to visit.
- **Search & Filter** – Filter by building, hours, noise level, or amenities. Sort by distance, rating, or recency.
- **Reviews & Tips** – Students rate spaces and share insider knowledge (e.g., "Third floor is quieter").
- **Personal Features** – Save favorites and create custom lists.

### Example User Flow

1. Open StudySpot
2. Filter for "Quiet + Outlets + Open Now"
3. Review top matches
4. Walk to selected location

---

## Team Members

| Role | Name | GitHub | Email |
|------|------|--------|-------|
| Product Owner & Developer | Leia Yun | [@yunLeia](https://github.com/yunLeia) | sy3544@nyu.edu |
| Scrum Master & Developer | Layan Alyas | [@layan-al](https://github.com/layan-al) | laa9624@nyu.edu |
| Developer | Aayan Mathur | [@aayanmathur](https://github.com/aayanmathur) | am12611@nyu.edu |
| Developer | Tianlang Qin | [@tianlangqin](https://github.com/tianlangqin) | tq2098@nyu.edu |
| Developer | Max Wu | [@MagSwoo](https://github.com/MagSwoo) | mw5608@nyu.edu |

---

## How to Set Up and Run the Project

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/agile-students-spring2026/final-studyspot.git
cd final-studyspot
```

### 2. Set Up Environment Variables

Copy the example env file and fill in the values. The actual `.env` file is never committed to version control.

```bash
cp back-end/.env.example back-end/.env
```

Required variables:
- `DB_CONNECTION_STRING` — MongoDB Atlas connection string
- `JWT_SECRET` — a long random string for signing JWT tokens
- `PORT` — server port (use `5001` to avoid macOS AirPlay conflict on 5000)

> **Note for admins/graders:** The `.env` file with real credentials has been submitted separately via the team's messenger channel.

### 3. Set Up and Run the Back End

```bash
cd back-end
npm install
npm start
```

Runs at [http://localhost:5001](http://localhost:5001).

#### Tests

```bash
npm test          # mocha unit tests
npm run coverage  # mocha + c8 coverage report
```

### 4. Set Up and Run the Front End

In a second terminal:

```bash
cd front-end
npm install
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

---

## Extra Credit

- **Continuous Integration** — GitHub Actions runs the full backend test suite (`npm test` + `npm run coverage`) on every push and pull request. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- **Continuous Deployment** — Pushes to `master` automatically deploy to the DigitalOcean droplet via SSH. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Contributing

To contribute to this project, please follow the [Feature Branch git workflow](https://knowledge.kitchen/content/courses/agile-development-and-devops/slides/feature-branch-workflow/) and see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Additional Documents

- See the [App Map & Wireframes](instructions-0a-app-map-wireframes.md) and [Prototyping](./instructions-0b-prototyping.md) instructions for the initial user experience design requirements.
- See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for the requirements of Sprint Planning for each sprint.
- See the [Front-End Development instructions](./instructions-1-front-end.md) for the requirements of the initial front-end implementation.
- See the [Back-End Development instructions](./instructions-2-back-end.md) for the requirements of the initial back-end implementation.
- See the [Database Integration instructions](./instructions-3-database.md) for the requirements of integrating a database into the back-end.
- See the [Deployment instructions](./instructions-4-deployment.md) for the requirements of deploying the application.