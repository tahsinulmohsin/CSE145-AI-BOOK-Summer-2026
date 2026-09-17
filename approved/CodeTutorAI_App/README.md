# CodeTutor.AI

An AI programming tutor for complete beginners, built by Claude (Anthropic) from a
single natural-language prompt. Learners pick a language — Python, C, C++, or Java —
state a goal in their own words, and are taught one concept at a time through a live,
adaptive conversation with an AI tutor.

This folder is the output package for our book chapter submission. It contains the
application exactly as generated inside Claude.ai, plus this note on how to run it.

## Contents

- `CodeTutor.jsx` — the complete application (React, single file).

## What it does

1. **Setup screen** — the learner selects a language and describes what they want to
   learn, either via quick-select chips ("just the basics," "interview prep," etc.)
   or free text.
2. **Tutoring screen** — a chat interface where the AI tutor explains one idea at a
   time, gives a short runnable code example, checks understanding with a small
   exercise, and adapts its pacing and feedback to what the learner actually types.

## How to run it

This app was built as a **Claude.ai Artifact** and calls the Anthropic API directly
from the browser (no separate backend server is required). There are two ways to run it:

**Option A — Inside Claude.ai (recommended, zero setup)**
Paste the contents of `CodeTutor.jsx` into a new chat on claude.ai and ask Claude to
render it as an artifact. The API calls are handled automatically by the Claude.ai
environment — no API key needed on your end.

**Option B — As a standalone React project**
1. Create a new React project (e.g. `npm create vite@latest my-app -- --template react`).
2. Replace `App.jsx` with `CodeTutor.jsx` from this folder.
3. Because this file calls `https://api.anthropic.com/v1/messages` directly from
   client-side code, you will need to either:
   - proxy the request through your own backend and attach a valid Anthropic API key
     (do **not** expose a real API key in client-side code), or
   - swap the `fetch` call in `callTutor()` for your own backend endpoint.
4. `npm install && npm run dev`.

## Notes for reviewers

- No user data is stored or transmitted anywhere except to the Anthropic API for the
  purpose of generating the next tutoring message.
- The interface uses only in-memory React state; nothing persists between sessions
  (see "Remarks" in the accompanying book chapter for suggested improvements).
