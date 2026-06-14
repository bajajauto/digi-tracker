# Digitization Project Tracker

A shared tracker for the team's web apps, automations, and dashboards. Tracks
project type, status, priority, and the requesting department.

It works in three modes automatically:

- **Synced (shared)** — when deployed on Vercel with Redis storage connected. Everyone sees the same list.
- **This device** — if no storage is connected, it saves locally in the browser so it still works.
- **Preview** — if neither is available (e.g. opened as a bare file), it runs in memory.

The badge in the top-right tells you which mode you're in.

---

## Deploy to Vercel

You'll need a free Vercel account and a free Upstash Redis store (both have generous free tiers).

### 1. Get the code onto Vercel
Either:
- Push this folder to a GitHub repo, then in Vercel click **Add New → Project** and import it, **or**
- Install the CLI (`npm i -g vercel`), run `vercel` in this folder, and follow the prompts.

No build step or framework is needed — Vercel serves `index.html` and runs `api/projects.js` automatically.

### 2. Connect storage (this is what makes it shared)
In your Vercel project dashboard:
1. Open the **Storage** tab → **Create / Connect Database**.
2. Choose **Upstash for Redis** from the Marketplace and create a database (the free plan is fine).
3. Connect it to this project. Vercel injects the credentials (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) as environment variables automatically.

### 3. Redeploy
Trigger a new deployment (push a commit, or **Redeploy** in the dashboard) so the function picks up the new environment variables.

That's it — open the URL and the badge should read **Synced · shared**. Share the link with the team.

---

## Local development
```bash
npm install
vercel dev      # runs the API + static site locally
```
Without a connected store, it falls back to device storage, so you can still try the UI.

## Notes
- All projects are stored under a single Redis key as a JSON array — simple and plenty for a team-sized list.
- Saves are last-write-wins; the app re-pulls every 15 seconds while synced so teammates' changes appear.
- To change the data model or statuses, edit the `STATUSES` list and form fields in `index.html`.
