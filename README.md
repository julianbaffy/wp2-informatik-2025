# About
This homepage was created to showcase the results of student's projects. The students built websites using HTML and CSS and games with Pygame Zero which are stored in the `static` directory of this repository. While Tailwind CSS is used in some snippets, I tried to stick to pure CSS to keep the project accessible for the students.

The students' websites and games are displayed in gids, organized into tabs by course. Each project can be liked (❤️) by visitors, and there is a password-protected admin area to manage those likes.

The website is currently deployed on Vercel: https://wp2-informatik-2025.vercel.app/ .

# Manage courses and student's pages and games

## Open Tabs
By default, the `WebsiteTabs` or `GameTabs` component will open the first non-empty course, or the first course if all are empty.
You can change this by setting the `manualStartPosition` variable in `src/routes/websites/+page.svelte` or `src/routes/pygames/+page.svelte` to any `courseID`.
**This is not recommended**.

If you want a specific tab to be open when sharing the page, this can be handled via the URL's searchParams, which are set automatically when a tab is opened (e.g., ...?course=2).

## Limits
The layout includes breakpoints to support all screen sizes for up to 4 courses.
5 courses are still supported on large and medium screens.

There is no limit to the number of student pages within a course.

## Adding new Studentpages and Courses
1. Add a new directory to static/studentpages/ and follow the strict naming convention: </br>
  ```
  static/studentpages/[courseID]\_[teacherName]/[studentName]\_[studentSurname]/...
  ```
  - `courseID` must be a number or a single letter.
  - Each student’s directory must contain a file named `index.html` or `Index.html`. </br>
  This file will be used as starting page for the homepage and linked the grid.

2. Deploy by pushing the commit to GitHub (the site will be automatically deployed via Vercel). Locally run `npm run dev`.

To add a new, empty course, you have to save any file in it (e. g. just 'empty.html') because the Script runs in build but GitHub does not push empty directories. The file won't be displayed.

## Adding new Pygames and Courses
1. Add a new directory to static/pygames/ and follow the strict naming convention: </br>
  ```
  static/pygames/[courseID]\_[teacherName]/[studentName]\_[studentSurname]/...
  ```
  - `courseID` must be a number
  - Each student’s directory must contain a file named `download.zip` or a repository named `web`. `download.zip` will be linked on the download-button in gamgrid, the `web` will be linked on the `play online` button and be opened in a new tab. </br>

2. Deploy by pushing the commit to GitHub (the site will be automatically deployed via Vercel). Locally run `npm run dev`.

To add a new, empty course, you have to save any file in it (e. g. just 'empty.zip') because the Script runs in build but GitHub does not push empty directories. The file won't be displayed.

## What happen's?
The script `generate-links.js` will be run automatically in the prebuild and predev. It creates or replaces four json files:

1. `/src/lib/generated/games/courses.json` and `/src/lib/generated/websites/courses.json` which look like this:
```json
[
  {
    "courseID": "1",
    "teacher": "EXAMPLE"
  },
  ...
]
```
They save the different courses, in which each project has been carried out.

2. `/src/lib/generated/games/games.json`, which looks like this:
```json
[
  {
    "id": "1_EXAMPLE/Student_A",
    "courseID": "1",
    "teacher": "EXAMPLE",
    "title": "Student A",
    "downloadUrl": "/pygames/1_EXAMPLE/Student_A/download.zip",
    "onlineUrl": "..."
  },
  ...
]
```

3. `/src/lib/generated/websites/links.json`, which looks like this:
```json
[
  {
    "id": "1_EXAMPLE/Student_A",
    "courseID": "1",
    "teacher": "EXAMPLE",
    "title": "Student A",
    "url": "studentpages/1_EXAMPLE/Student_A/index.html"
  },
  ...
]
```

### The `id` field
Every entry in `games.json` and `links.json` has an `id`, built from `[courseFolder]/[studentFolder]` (e.g. `1_BAF/Kian_K`). It stays stable no matter which URL variant a game currently has (download only, online only, or both), and it is **not** regenerated data like the rest of the file — it is used as the primary key for the like feature (see below), both in Redis and in the admin overview. Renaming a student's folder is therefore treated as a new project (it starts at 0 likes again).

# Admin area & environment setup

The project has a small, password-protected admin area at `/admin`, used to manage the like counters (see below). It needs two things configured via environment variables, both **not committed to git** (`.env` is gitignored; `.env.example` documents the required keys):

```dotenv
# Redis (see below)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Admin login (see below)
ADMIN_PASSWORD_HASH=
```

These need to be set in two places:
- **Locally**: create a `.env` file in the project root with the three values above (no quotes around the values).
- **On Vercel**: Project → Settings → Environment Variables, same three keys, for Production and Preview (and Development if you use `vercel dev`).

## Redis (Upstash)
Like counts and admin sessions are stored in [Upstash Redis](https://upstash.com) rather than in the generated JSON files, because those files are only rebuilt on deploy and Vercel's serverless functions don't have a writable, persistent filesystem.

Set it up once:
1. In the Vercel dashboard, go to **Storage → Marketplace** and add an **Upstash** database (not the plain "Redis"/Redis Cloud listing — its free tier has no persistence, which we need here). Alternatively, create a free database directly on [upstash.com](https://upstash.com) and skip the Vercel integration entirely.
2. Open the database (via "Open in Upstash" if it came from the Vercel Marketplace) and copy the **REST API** `URL` and `TOKEN`.
3. Paste them into `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, both locally and on Vercel.

The Upstash Marketplace integration also injects its own, differently-named variables (`..._KV_REST_API_URL`, etc.) into the Vercel project — those are not used by this app and can be ignored; the app only reads the two `UPSTASH_REDIS_REST_*` names above.

## Admin login
There is exactly one admin account, no username, just a password. The password itself is never stored — only a salted hash (`ADMIN_PASSWORD_HASH`, format `salt:hash`), generated with:

```bash
npm run admin:hash-password
```

This asks for a password and prints the line to paste into `.env` / Vercel. Log in at `/admin/login`; a session cookie (backed by Redis, 7 days) then grants access to `/admin` and `/admin/likes` until you log out or the session expires.

# Like feature (❤️)

Every game and every website card has a heart button. Clicking it likes the project (counter +1, icon turns red); clicking again removes the like (counter −1, icon turns grey again) — it's a toggle, not a one-way vote.

## How it stays "just once" per project
A random, anonymous `voter_id` cookie (1 year, httpOnly) is set on first visit — no login required for visitors, only for the admin area. Redis remembers, per project and per `voter_id`, whether that browser currently has an active like. This is enough for a classroom feedback tool; it is not meant to withstand someone deliberately clearing cookies or using a different browser to vote again.

## Where the data lives
Like counts are intentionally **not** part of `games.json` / `links.json` — those are only regenerated on build/deploy, while likes need to change instantly. Everything related to likes lives in Redis instead, keyed by the project's `id`:

- `page:<id>:count` — current like count
- `page:<id>:epoch` — incremented every time an admin resets this project
- `page:<id>:epoch:<epoch>:voted:<voterId>` — marks that a given browser currently likes this project in the current epoch

Resetting bumps the epoch instead of deleting every voter's record individually — old "voted" entries simply become irrelevant for the new epoch, so everyone can like again.

## Display & updates
`/pygames` and `/websites` stay statically prerendered as before; a small client-side script (`src/lib/stores/likes.svelte.ts`) fetches all current counts in a single request on page load and again every 7 seconds, so counts update live without a manual page refresh. Clicking a heart updates the button immediately (optimistic UI) and only reverts if the request actually fails.

## Admin overview & reset (`/admin/likes`)
Lists every course (games and websites share the same `courseID`, e.g. `1_BAF`, so both appear under one heading) with each project's current like count. Each course has two independent buttons, **"Spiele zurücksetzen"** and **"Websites zurücksetzen"**, so games and websites of the same course can be reset separately — useful for running a new round of feedback in class.

# sv

This app is built with Svelte and svelteKit. Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
