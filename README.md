# TraceFlow

**Stop digging through chats for what matters.**

TraceFlow turns unstructured project communication — WhatsApp threads, meeting notes, emails — into structured, searchable project memory. Paste a conversation, and it extracts a summary, tasks with assignees and deadlines, and decisions/approvals — automatically, and always linked back to the conversation it came from.

## The problem

Project teams don't lack communication — they're buried in it. A single conversation can contain a decision, several tasks, a deadline, and an approval request, all at once. Manually converting that into task lists and meeting minutes means information gets missed, forgotten, misassigned, or lost the moment the chat scrolls past it.

TraceFlow is an intelligent communication layer that reads project conversations and pulls out what actually matters.

## Features

- **Conversation capture** — paste WhatsApp threads, meeting notes, emails, or call transcripts
- **AI-powered extraction** — a single conversation is processed into a structured summary, task list, and decision log via a strict JSON-schema LLM call (Groq)
- **Responsibility detection** — tasks are matched to real project members by name; unmatched names are flagged for manual review instead of silently guessing or dropping the assignment
- **Deadline detection** — resolves relative dates ("by Friday", "next Monday") into real calendar dates, using the conversation's date as a reference point
- **Decision & approval extraction** — classifies extracted items as a firm decision, a completed approval, or a pending approval, so blockers are distinguishable from settled items
- **Searchable project memory** — full-text search across all past conversations, tasks, and decisions for a project, not just what's currently on screen
- **Traceability** — every task and decision links back to the exact conversation it was extracted from
- **Role-based project membership** — invite-code based joining, with roles (project manager, client, architect, contractor, vendor) scoped per project rather than globally

## Tech stack

- **Backend:** Express, MongoDB / Mongoose, JWT + bcrypt auth
- **Frontend:** Next.js, Redux Toolkit
- **AI:** Groq API (`openai/gpt-oss-120b`) with strict JSON schema mode for reliable structured extraction

## Architecture

```
User pastes/uploads a conversation
        ↓
POST /api/conversations → saved as a Conversation doc
        ↓
AI service sends the raw text (+ today's date as reference) to Groq
        ↓
Structured JSON returned: { summary, tasks[], decisions[] }
        ↓
Extraction parser:
  - matches each task's extracted assignee name against the project's
    real members; unmatched names are kept as a raw fallback and
    flagged for review
  - resolves relative deadlines to real dates
  - classifies each decision as decision / approval / pending_approval
  - creates Task and Decision documents, each linked back to the
    source Conversation and Project
        ↓
Dashboard, task list, and decision views read from these collections
Search queries across Conversations, Tasks, and Decisions by project
```

## Project structure

```
backend/
├── models/          User, Project, Conversation, Task, Decision
├── controllers/      auth, project, conversation, task, decision, search
├── services/         aiService.js (Groq extraction), extractionParser.js
├── middleware/        auth, project-membership checks, error handling
└── routes/

frontend/
├── app/               Next.js pages: dashboard, project overview,
│                       my-tasks, decisions, communication, search
├── config/redux/       actions + slices per domain (auth, project,
│                       task, decision, conversation, search)
└── layouts/            shared dashboard/user layout with nav
```

## Getting started

### Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```
MONGO_URI
JWT_SECRET
GROQ_API_KEY
PORT=5000
```

```bash
node server.js
```

### Frontend
```bash
cd frontend
npm install
```


```

```bash
npm run dev
```

## Core flow

1. **Sign up / log in**
2. **Create a project** (becomes project manager) or **join one** via invite code, selecting a role
3. **Paste a conversation** on the Communication page
4. TraceFlow extracts a summary, tasks, and decisions — visible immediately on the Dashboard, My Tasks, and Decisions pages
5. **Search** across all past conversations, tasks, and decisions for the project

## Notes on design decisions

- Roles are scoped per-project, not global on the user — the same person can be a project manager on one project and a contractor on another
- Assignee matching is intentionally conservative (name-based matching against real members) rather than guessing — an unmatched name is surfaced for human review instead of silently misassigned, directly addressing the "assigned to the wrong person" failure mode this project is built to solve
- If AI extraction fails for any reason, the raw conversation is still saved — no data is lost even if the extraction step errors out

## Status

Working prototype. Core pipeline (auth → project membership → conversation capture → AI extraction → task/decision creation → search) is built and tested end-to-end.