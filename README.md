# TaskFlow — Personal Task Manager

A full-stack personal task manager built as part of the Studio Graphene Node.js + React assessment (Exercise 1). Users can create, view, edit, delete, and reorder tasks, with optional due dates, descriptions, and status filtering — all persisted to a JSON file on the server.

---

## Live Demo

| Layer | URL |
|---|---|
| Frontend | *(Deploy to Vercel — link here after deploy)* |
| Backend | *(Deploy to Render — link here after deploy)* |

---

## Tech Stack

| Tool | Purpose | Why |
|---|---|---|
| **Node.js + Express** | REST API server | Industry-standard, minimal boilerplate |
| **TypeScript** | Both client & server | Type safety, better DX, fewer runtime bugs |
| **React + Vite** | Frontend SPA | Fast HMR, modern tooling, no CRA overhead |
| **Axios** | HTTP client | Cleaner than fetch, easy base URL config |
| **@dnd-kit** | Drag-and-drop reorder | Accessible, tree-shakeable, no jQuery dep |
| **JSON file** | Data persistence | Simple, no DB setup, survives server restarts |
| **Vitest + Supertest** | Backend API tests | Native to Vite ecosystem, fast |
| **Vanilla CSS** | Styling | Full control, no class-name memorisation |

---

## How to Run Locally

> Assumes you have **Node.js ≥ 18** installed. No other global tools needed.

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

Server starts at **http://localhost:3001**

### 3. Start the frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

App opens at **http://localhost:5173**

### 4. Run backend tests (optional)

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:3001`

### `GET /api/tasks`
Returns all tasks sorted by order (drag-and-drop position), then by creation date descending.

**Response** `200`
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2025-12-31",
    "completed": false,
    "createdAt": "2025-06-04T10:00:00.000Z",
    "order": 0
  }
]
```

---

### `POST /api/tasks`
Create a new task. `title` is required.

**Request body**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2025-12-31"
}
```

**Response** `201` — the created task object  
**Response** `400` — `{ "error": "Title is required..." }` if title is missing or blank

---

### `PATCH /api/tasks/:id`
Update any fields of a task (partial update).

**Request body** (all fields optional)
```json
{
  "title": "Updated title",
  "completed": true,
  "dueDate": "2026-01-15"
}
```

**Response** `200` — the updated task object  
**Response** `404` — task not found

---

### `DELETE /api/tasks/:id`
Delete a task permanently.

**Response** `200` — `{ "message": "Task deleted successfully" }`  
**Response** `404` — task not found

---

### `PUT /api/tasks/reorder`
Reorder tasks by providing a new ordering of IDs (used by drag-and-drop).

**Request body**
```json
{
  "orderedIds": ["uuid-3", "uuid-1", "uuid-2"]
}
```

**Response** `200` — full updated task array  
**Response** `400` — `{ "error": "orderedIds must be an array" }` if body is invalid

---

### `GET /health`
Health check endpoint.

**Response** `200` — `{ "status": "ok", "timestamp": "..." }`

---

## Project Structure

```
task-manager/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── api/tasks.ts           # Axios wrapper for all API calls
│   │   ├── components/
│   │   │   ├── TaskCard.tsx       # Single task row (toggle, edit, delete)
│   │   │   ├── TaskForm.tsx       # Add/edit modal form
│   │   │   ├── FilterBar.tsx      # All / Active / Completed pills
│   │   │   ├── SearchBar.tsx      # Live search input
│   │   │   ├── TaskStats.tsx      # Active / completed / overdue counts
│   │   │   ├── EmptyState.tsx     # Context-aware empty state
│   │   │   ├── ConfirmDialog.tsx  # Delete confirmation modal
│   │   │   └── DraggableTaskList.tsx  # @dnd-kit drag-and-drop wrapper
│   │   ├── hooks/useTasks.ts      # All state, filtering, and server sync
│   │   ├── types/task.ts          # TypeScript interfaces
│   │   ├── App.tsx                # Root component, layout
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Full design system (dark mode, tokens)
│   ├── index.html
│   └── package.json
│
├── server/                        # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/taskController.ts  # HTTP handlers
│   │   ├── services/taskService.ts        # Business logic + JSON I/O
│   │   ├── routes/taskRoutes.ts           # Express router
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts            # Centralised error handling
│   │   │   └── validateTask.ts            # Request body validation
│   │   ├── types/task.ts                  # TypeScript interfaces
│   │   └── index.ts                       # App entry, server start
│   ├── data/tasks.json                    # Persisted task data
│   ├── tests/tasks.test.ts                # Supertest API tests
│   └── package.json
│
└── README.md
```

---

## What Works

- ✅ Full CRUD — create, read, update, delete tasks
- ✅ Toggle complete/incomplete
- ✅ Filter by All / Active / Completed
- ✅ Live search by title (press `/` to focus)
- ✅ Overdue badge (red pulse dot + red text for past-due incomplete tasks)
- ✅ Task count stats (total, active, completed, overdue)
- ✅ Empty state with context-aware messages
- ✅ Loading and error states
- ✅ Delete confirmation dialog
- ✅ Drag-and-drop reorder (mouse, touch, and keyboard)
- ✅ JSON file persistence (tasks survive server restarts)
- ✅ Dark mode design with animated background blobs
- ✅ Fully responsive — works on mobile
- ✅ Accessible (ARIA roles, labels, keyboard navigation)
- ✅ Backend API tests (10 cases across all 5 endpoints)

---

## Next Steps

With more time I would:

1. **Authentication** — Add user accounts (JWT) so multiple people can each have their own task list
2. **Due date reminders** — Email or push notifications when a task is approaching its due date
3. **Task priorities** — Low / Medium / High priority flag with visual sorting
4. **Tags / labels** — Group related tasks by custom colour-coded tags
5. **Optimistic UI improvements** — Smoother animations when adding/removing tasks from filtered views
6. **SQLite migration** — Replace JSON file with SQLite for proper concurrent access and query efficiency
7. **PWA support** — Service worker + manifest for offline access and installability
8. **E2E tests** — Playwright tests covering the full add → edit → delete flow in the browser

---

## Notes

- AI tools (Claude) were used to assist in scaffolding and code review. Every line has been understood, reviewed, and adapted to fit the project's specific requirements.
- The `/api/tasks/reorder` route is registered before `/:id` to prevent Express treating the literal string `"reorder"` as a task ID.
