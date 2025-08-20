# About
This homepage was created to showcase the results of student's projects. The students built websites using HTML and CSS and games with Pygame Zero which are stored in the `static` directory of this repository. While Tailwind CSS is used in some snippets, I tried to stick to pure CSS to keep the project accessible for the students.

The students' websites and games are displayed in gids, organized into tabs by course.

The website is currently deployed on Vercel: https://wp2coursepage.vercel.app/ .

# Manage courses and student's pages and games

## Open Tabs
By default, the `WebsiteTabs` or `GameTabs` component will open the first non-empty course, or the first course if all are empty.
You can change this by setting the `manualStartPosition` variable in `src/routes/websites/+page.svelte` or `src/routes/pygames/+page.svelte` to any `courseID`.
**This is not recommended**. If you want a specific tab to be open when sharing the page, this can be handled via the URL's searchParams, which are set automatically when a tab is opened (e.g., ...?course=2).

## Limits
The layout includes breakpoints to support all screen sizes for up to 4 courses.
5 courses are still supported on large and medium screens.

There is no limit to the number of student pages within a course.

## Adding new Studentpages and Courses
1. Add a new directory to static/studentpages/ and follow the strict naming convention: </br>
  ```
  static/studentpages/[courseID]\_[teacherName]/[studentName]\_[studentSurname]/...
  ```
  - `courseID` must be a number
  - Each student’s directory must contain a file named `index.html` or `Index.html`. </br>
  This file will be used as starting page for the homepage and linked linked the grid.

2. Deploy by pushing the commit to GitHub (the site will be automatically deployed via Vercel). Locally run `npm run dev`.

To add a new, empty course, you have to save any file in it (e. g. just 'empty.html') because the Script runs in build but GitHub does not push empty directories. The file won't be displayed.

## Adding new Pygames and Courses
1. Add a new directory to static/pygames/ and follow the strict naming convention: </br>
  ```
  static/pygames/[courseID]\_[teacherName]/[studentName]\_[studentSurname]/...
  ```
  - `courseID` must be a number
  - Each student’s directory must contain a file named `download.zip`. </br>
  This file will be linked as download file in the grid.

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
    "courseID": "1",
    "teacher": "EXAMPLE",
    "title": "Student A",
    "downloadUrl": "studentpages/1_EXAMPLE/Student_A/index.html",
    "onlineUrl": "..."
  },
  ...
]
```
The onlineUrl is not set yet since we did not work out, how to run Pygame Zero with pygbag.

3. `/src/lib/generated/websites/links.json`, which looks like this:
```json
[
  {
    "courseID": "1",
    "teacher": "EXAMPLE",
    "title": "Student A",
    "url": "studentpages/1_EXAMPLE/Student_A/index.html"
  },
  ...
]
```

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
