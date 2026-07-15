# Melodyc

<p align="center">
  <strong>AI-powered music generation platform</strong><br/>
  Generate original songs from text descriptions, custom lyrics, or style prompts.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python" />
</p>

---

## Overview

Melodyc is an open-source SaaS platform that lets users generate original music through artificial intelligence. Describe a mood, paste your lyrics, or define a style — Melodyc takes care of the rest, producing a complete track with audio and AI-generated cover art.

Built with a modern full-stack architecture, Melodyc is designed to be a real-world reference for anyone who wants to learn how to build a production-ready SaaS: authentication, payments, background job queues, and serverless GPU inference — all working together.

**All platforms used offer a free tier** — you won't need to spend anything to start developing.

---

## Features

- 🎵 AI music generation with ACE-Step v1 3.5B
- 🧠 Automatic lyrics and prompt generation with Qwen2-7B-Instruct
- 🖼️ AI cover art generation with SDXL-Turbo
- 🎤 Three generation modes: free description, custom lyrics, described lyrics
- 🎸 Instrumental track option (no vocals)
- ⚡ Serverless GPU processing with Modal (GPU L40S)
- 📊 Background job queue system with Inngest
- 💳 Credit-based usage system
- 💰 Polar.sh integration for purchasing credit packages
- 👤 User authentication with BetterAuth
- 🎧 Community feed to discover, listen to, and like generated tracks
- 🎛️ Personal dashboard to manage, listen to, and publish your music
- 📱 Modern UI with Next.js, Tailwind CSS and ShadCN

---

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, ShadCN |
| Authentication | BetterAuth |
| Payments | Polar.sh |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Queue / Workflow | Inngest |
| Storage | AWS S3 |
| AI Backend | Python 3.12, Modal (GPU L40S) |
| Music Model | ACE-Step v1 3.5B |
| Text Model | Qwen2-7B-Instruct |
| Image Model | SDXL-Turbo |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12
- A [Modal](https://modal.com) account
- A [Neon](https://neon.tech) account (PostgreSQL)
- A [Polar.sh](https://polar.sh) account
- An [AWS](https://aws.amazon.com) account (S3)
- An [Inngest](https://inngest.com) account

### Clone the repository

```bash
git clone --recurse-submodules https://github.com/andrebuilds/melodyc.git
cd melodyc
```

---

## Backend Setup

> For the complete step-by-step guide, see [backend/getting-started.md](backend/getting-started.md).

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure Modal
modal setup

# Run locally
modal run main.py

# Deploy
modal deploy main.py
```

---

## AWS S3 Configuration

Two separate IAM users are required — one for the backend (upload + read) and one for the frontend (read-only + presigned URLs).

**Backend IAM policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUploadAndRead",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::melodyc-bucket/*"
    },
    {
      "Sid": "AllowList",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::melodyc-bucket"
    }
  ]
}
```

**Frontend IAM policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRead",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::melodyc-bucket/*"
    },
    {
      "Sid": "AllowList",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::melodyc-bucket"
    }
  ]
}
```

For the full IAM setup walkthrough, see [backend/getting-started.md](backend/getting-started.md).

---

## Frontend Setup

> For the complete step-by-step guide, see [frontend/getting-started.md](frontend/getting-started.md).

```bash
# Install dependencies
cd frontend
npm install

# Configure environment variables
cp .env.example .env
# Fill in your values (database, AWS, Modal, BetterAuth, Polar)

# Apply database migrations
npx prisma migrate dev

# Start the frontend
npm run dev

# Start the Inngest queue (separate terminal)
npx inngest-cli@latest dev
```

---

## Documentation

| Section | File |
|---|---|
| Backend guide (Modal, AWS, Python) | [backend/getting-started.md](backend/getting-started.md) |
| Frontend guide (Auth, DB, Inngest, Payments, Deploy) | [frontend/getting-started.md](frontend/getting-started.md) |

---

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, contribution requirements, and pull request guidelines.

## Community and Support

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Support](SUPPORT.md)
- [Security Policy](SECURITY.md)
- [Governance](GOVERNANCE.md)
- [Maintainers](MAINTAINERS.md)
- [Changelog](CHANGELOG.md)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Authors

Created and maintained by:

- **Andrea D'Ambrosio** — [github.com/andrebuilds](https://github.com/andrebuilds)
- **Thomas Fortuna** — [github.com/fortunathomas](https://github.com/fortunathomas)