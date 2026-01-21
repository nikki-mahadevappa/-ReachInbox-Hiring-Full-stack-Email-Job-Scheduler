# ReachInbox – Email Scheduler Assignment

## Tech Stack
- Backend: Node.js, TypeScript, Express
- Queue: BullMQ + Redis
- Database: PostgreSQL
- SMTP: Ethereal Email
- Frontend: React (TypeScript)
- Infra: Docker (Postgres, Redis)

## Features Implemented

### Backend
- Email scheduling API
- Persistent delayed jobs using BullMQ
- PostgreSQL-backed email storage
- Redis-backed rate-safe queueing
- Worker-based email sending
- Restart-safe scheduling (no cron jobs)
- Ethereal SMTP integration

### Frontend
- Compose email UI
- View scheduled emails
- View sent emails
- API-connected React dashboard

## Architecture Overview
- Emails are stored in PostgreSQL
- Each email is added to BullMQ with delay
- Redis persists jobs across restarts
- Worker processes jobs and sends emails
- Status updates written back to DB

## Rate Limiting & Concurrency
- BullMQ worker concurrency enabled
- Redis-backed queue ensures safe parallel processing
- Jobs are delayed when required

## How to Run

### Backend
```bash
cd backend
npm install
npm run dev
