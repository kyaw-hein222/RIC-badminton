# 🏸 RIC Badminton — Match Queue Board

A real-time badminton match queue system built for the RIC club. Features a public live scoreboard, admin management panel, and club records — all deployed serverlessly on AWS.

## ✨ Features

- **Live Scoreboard** — ongoing matches highlighted with real-time elapsed time
- **Queue Management** — upcoming matches displayed in order
- **Player Check-In** — avatar photos, skill ranks (S/A/B/C/D), match stats
- **Admin Panel** — add/edit/delete matches, manage player roster, passcode-protected
- **Club Records** — historical match data and player statistics
- **Offline Fallback** — works with localStorage when API is unavailable

## 🛠️ Tech Stack

**Frontend**: Vanilla HTML / CSS / JS (no build step)  
**Backend**: AWS Lambda (Node.js 20) + DynamoDB  
**Hosting**: S3 + CloudFront (OAC)  
**API**: Amazon API Gateway (HTTP)

## 📂 Project Structure

```
frontend/      → Static HTML pages (deploy to S3)
backend/       → Lambda function (deploy to AWS Lambda)
docs/          → Deployment guide & session logs
AGENTS.md      → Universal AI agent context file
SPEC.md        → Design specification
```

## 🚀 Deployment

See `docs/aws_deployment_guide.pdf` and the deployment checklist in `AGENTS.md`.

## 👤 Author

**kyaw-hein222** — [GitHub](https://github.com/kyaw-hein222)
