# CodeSync

A real-time collaborative online code editor. Create a room, share the ID, and write, run, and chat about code together — live, in the browser, with no setup on your teammates' end.

Think of it as a lightweight, shared coding room: multiple people editing the same file at once, a real compiler behind the "Run" button, a chat panel for talking through the problem, and a live list of who's in the room with you.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder structure](#folder-structure)
5. [Installation](#installation)
6. [Environment variables](#environment-variables)
7. [Running the backend](#running-the-backend)
8. [Running the frontend](#running-the-frontend)
9. [MongoDB setup](#mongodb-setup)
10. [Judge0 / Piston setup](#judge0--piston-setup)
11. [API documentation](#api-documentation)
12. [Socket.io architecture](#socketio-architecture)
13. [Screenshots](#screenshots)
14. [Known limitations & future improvements](#known-limitations--future-improvements)
15. [Team](#team)
16. [Deployment](#deployment)

---

## Features

- **Authentication** — register, log in, log out, JWT-based sessions, protected routes, hashed passwords (bcrypt).
- **Rooms** — create a room, get a unique shareable room ID, join with that ID, leave, see current members.
- **Real-time collaborative editor** — Monaco Editor (the engine behind VS Code) with true multi-user editing over Socket.io: type in one browser, see it appear in another, instantly, with no page refresh.
- **Multi-language support** — JavaScript, Python, C++, and Java out of the box, driven by a single shared language-configuration file (not hardcoded everywhere).
- **Code execution** — a "Run" button that sends code to a compiler service (Judge0 or Piston) and streams back stdout, stderr, compile errors, and status.
- **Live chat** — per-room chat with sender name, timestamp, auto-scroll, and join/leave notifications.
- **Online users panel** — see who's currently in the room, live.
- **Dark, developer-focused UI** — built with Tailwind CSS, responsive down to mobile, with loading states and toast notifications throughout.

## Tech stack

**Frontend:** React, JavaScript, Tailwind CSS, React Router DOM, Axios, Monaco Editor, Socket.io Client, Vite

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.io

**Code execution:** Judge0 (default-configurable) or Piston (free, no API key — used as the default in `.env.example`)

**Database:** MongoDB Atlas (or any MongoDB instance)

## Architecture

```
Frontend (React)
     │
     ├──── REST (Axios) ────► Express API ────► MongoDB
     │
     └──── Socket.io ───────► Socket Server (same Express process)

Code execution:
Frontend ─► Backend ─► Judge0/Piston ─► Backend ─► Frontend
```

The backend runs a single Node process: Express serves the REST API and Socket.io shares the same HTTP server for real-time events. This keeps deployment simple (one backend service) while cleanly separating REST concerns (auth, CRUD) from real-time concerns (live code sync, chat, presence).

## Folder structure

```
CodeSync/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI pieces (Navbar, ChatPanel, OnlineUsers, ...)
│   │   ├── pages/              # Route-level pages (LandingPage, Dashboard, CodingRoom, ...)
│   │   ├── layouts/             # MainLayout, DashboardLayout
│   │   ├── hooks/                # useAuth, useSocket
│   │   ├── context/               # AuthContext
│   │   ├── services/               # Axios API layer (authService, roomService, codeService)
│   │   ├── utils/                    # Shared language config for Monaco + execution
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/                     # Express + Socket.io backend
│   ├── src/
│   │   ├── config/               # MongoDB connection
│   │   ├── controllers/           # Auth, room, code execution logic
│   │   ├── middleware/             # JWT auth guard, error handler, validation
│   │   ├── models/                  # User, Room, Message (Mongoose)
│   │   ├── routes/                   # Express routers
│   │   ├── services/                  # tokenService, judge0Service, pistonService
│   │   ├── sockets/                     # Socket.io connection + room event handlers
│   │   ├── utils/                        # asyncHandler, ApiError, language config, room ID generator
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json                # Convenience scripts to install/run both apps
└── README.md
```

## Installation

Requires **Node.js 18+** and access to a MongoDB instance (local or Atlas).

```bash
# From the CodeSync/ root
npm run install:all

# ...or manually:
cd server && npm install
cd ../client && npm install
```

## Environment variables

Copy each `.env.example` to `.env` and fill in real values. **Never commit a real `.env` file.**

### `server/.env`

| Variable | Description |
|---|---|
| `PORT` | Port the backend listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS and Socket.io (e.g. `http://localhost:5173`) |
| `CODE_EXEC_PROVIDER` | `judge0` or `piston` |
| `JUDGE0_API_URL` / `JUDGE0_API_KEY` / `JUDGE0_API_HOST` | Only needed if using Judge0 via RapidAPI |
| `PISTON_API_URL` | Defaults to the public Piston API; no key required |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | API rate limiting config |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend REST base URL, e.g. `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend Socket.io URL, e.g. `http://localhost:5000` |

## Running the backend

```bash
cd server
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET at minimum
npm run dev            # nodemon, restarts on file changes
# or
npm start
```

The API will be available at `http://localhost:5000/api`, with a health check at `GET /api/health`.

## Running the frontend

```bash
cd client
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

## MongoDB setup

**Option A — MongoDB Atlas (recommended for quick setup):**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from your IP (or `0.0.0.0/0` for development).
3. Copy the connection string and paste it into `server/.env` as `MONGO_URI`, replacing `<password>` with your database user's password.

**Option B — Local MongoDB:**

Install MongoDB Community Server locally and use:

```
MONGO_URI=mongodb://127.0.0.1:27017/codesync
```

## Judge0 / Piston setup

CodeSync supports two code execution backends, switchable via `CODE_EXEC_PROVIDER`:

**Piston (default, no API key needed):**
Nothing to configure — `PISTON_API_URL` already points to the public instance at `https://emkc.org/api/v2/piston`. Good for local development and demos.

**Judge0 (via RapidAPI):**

1. Subscribe to the [Judge0 CE API on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).
2. Copy your RapidAPI key into `server/.env` as `JUDGE0_API_KEY`.
3. Set `CODE_EXEC_PROVIDER=judge0` and `JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com`.

The API key is only ever read on the backend — it's never sent to or exposed in the frontend.

## API documentation

Base URL: `/api`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Log in, returns a JWT |
| GET | `/auth/me` | ✅ | Get the current user's profile |

### Rooms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/rooms` | ✅ | Create a room, returns a generated `roomId` |
| GET | `/rooms/:roomId` | ✅ | Get room details, current code, and members |
| POST | `/rooms/:roomId/join` | ✅ | Join an existing room |
| DELETE | `/rooms/:roomId/leave` | ✅ | Leave a room |
| GET | `/rooms/mine/recent` | ✅ | List the current user's recent rooms |
| GET | `/rooms/:roomId/messages` | ✅ | Get chat history for a room |

### Code execution

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/code/execute` | ✅ | Run code, body: `{ language, code, stdin }` |

All authenticated endpoints expect `Authorization: Bearer <token>`. All responses follow the shape `{ success, message?, data?, details? }`.

## Socket.io architecture

The client connects once per coding-room session (`useSocket` hook) and emits `join-room` with the room ID and user info. The server tracks room presence in memory (keyed by room ID and socket ID — deliberately not persisted to the database, since "who's online right now" should reset cleanly on server restart).

| Event | Direction | Purpose |
|---|---|---|
| `join-room` | client → server | Join a room; server replies with `code-sync` |
| `code-sync` | server → client | Sends the current code + language to a newly-joined client only |
| `code-change` | client → server | Broadcast a local edit |
| `code-update` | server → clients | Relayed edit to everyone else in the room (never echoed back to the sender) |
| `language-change` / `language-update` | client ↔ server | Sync the selected language across the room |
| `users-update` | server → clients | Full list of users currently in the room |
| `user-joined` / `user-left` | server → clients | Presence notifications |
| `send-message` / `receive-message` | client ↔ server | Chat, persisted to MongoDB |
| `leave-room` / `disconnect` | client → server | Clean up presence and notify the room |

Code changes are relayed to every socket **except the sender** — this is what prevents infinite update loops on the frontend. The server also debounces persisting code to MongoDB (1.5s after the last edit) so it doesn't write to the database on every keystroke.

## Screenshots

_Add screenshots of the landing page, dashboard, and coding room here once deployed._

- `docs/screenshot-landing.png`
- `docs/screenshot-dashboard.png`
- `docs/screenshot-room.png`

## Known limitations & future improvements

**Known limitations:**
- Online presence is in-memory per server instance — running multiple backend instances behind a load balancer would need a shared adapter (e.g. `socket.io-redis`) for presence and broadcast to work correctly across instances.
- No operational-transform or CRDT-based conflict resolution — concurrent edits at the exact same cursor position use "last write wins" via the debounced save, which is fine for pair programming but not designed for very large teams editing simultaneously.
- No file tree / multi-file support yet — each room holds a single code buffer.
- No test suite is included (see [Testing](#testing) note below).

**Future improvements:**
- Multi-file rooms with a file explorer
- Syntax-aware cursor/selection sharing between users
- Room-level permissions (view-only participants)
- Persistent chat search and export
- CRDT-based editing (e.g. Yjs) for stronger conflict resolution at scale

## Team

| Member | Role |
|---|---|
| Vaibhav | Backend |
| Backend Developer | Backend |
| Vaishnavi | Frontend |
| Frontend Developer | Frontend |

## Deployment

**Frontend → Vercel:**
1. Import the `client/` directory as a Vercel project.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add `VITE_API_URL` and `VITE_SOCKET_URL` as environment variables pointing to your deployed backend.

**Backend → Render:**
1. Create a new Web Service pointing at the `server/` directory.
2. Build command: `npm install`. Start command: `npm start`.
3. Add all variables from `server/.env.example` in Render's environment settings, with `CLIENT_URL` set to your deployed Vercel URL.

**Database → MongoDB Atlas:**
Use the connection string from your Atlas cluster as `MONGO_URI` on Render. Make sure Atlas network access allows connections from Render's IP range (or `0.0.0.0/0`).

---

### Testing

Before shipping, verify: registration, login, logout, protected routes, room creation, joining a room from a second browser, real-time code sync between two tabs, chat, online user list updates, code execution (success and error cases), and disconnect/reconnect behavior. See [Known limitations](#known-limitations--future-improvements) for what isn't covered by automated tests in this MVP.
