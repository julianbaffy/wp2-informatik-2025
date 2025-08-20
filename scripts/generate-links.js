import { readdir, stat, writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const studentpagesBase = path.join(__dirname, "..", "static", "studentpages");
const pygamesBase = path.join(__dirname, "..", "static", "pygames");

const websitesOutputDir = path.join(__dirname, "..", "src", "lib", "generated", "websites");
const gamesOutputDir = path.join(__dirname, "..", "src", "lib", "generated", "games");

async function generateStudentPagesLinks() {
  const courseDirs = await readdir(studentpagesBase);
  const links = [];
  const coursesMap = new Map();

  for (const courseFolder of courseDirs) {
    const coursePath = path.join(studentpagesBase, courseFolder);
    const statCourse = await stat(coursePath);
    if (!statCourse.isDirectory()) continue;

    const courseMatch = courseFolder.match(/^(\d+)_([A-ZÄÖÜa-zäöü]+)$/);
    if (!courseMatch) {
      console.warn(`⚠️ Ordnername "${courseFolder}" entspricht nicht dem Muster "Zahl_Buchstaben"`);
      continue;
    }

    const courseID = courseMatch[1];
    const teacher = courseMatch[2];

    coursesMap.set(courseID, { courseID, teacher });

    const studentDirs = await readdir(coursePath);
    for (const studentDir of studentDirs) {
      const studentPath = path.join(coursePath, studentDir);
      const statStudent = await stat(studentPath);
      if (!statStudent.isDirectory()) continue;

      const indexNames = ["index.html", "Index.html"];
      let foundIndex = null;
      for (const name of indexNames) {
        try {
          const statIndex = await stat(path.join(studentPath, name));
          if (statIndex.isFile()) {
            foundIndex = name;
            break;
          }
        } catch {}
      }

      if (!foundIndex) continue;

      const title = studentDir.replace(/_/g, " ").replace(/\b(\w)/g, c => c.toUpperCase());
      const url = `studentpages/${courseFolder}/${studentDir}/${foundIndex}`;
      links.push({ courseID, teacher, title, url });
    }
  }

  return {
    links,
    courses: Array.from(coursesMap.values()).sort((a, b) => a.courseID.localeCompare(b.courseID)),
  };
}

async function generateGameLinks() {
  const courseDirs = await readdir(pygamesBase);
  const games = [];
  const coursesMap = new Map();

  for (const courseFolder of courseDirs) {
    const coursePath = path.join(pygamesBase, courseFolder);
    const statCourse = await stat(coursePath);
    if (!statCourse.isDirectory()) continue;

    const studentDirs = await readdir(coursePath);
    const courseMatch = courseFolder.match(/^(\d+)_([A-ZÄÖÜa-zäöü]+)$/);
    if (!courseMatch) {
      console.warn(`⚠️ Ungültiger Kursordner "${courseFolder}"`);
      continue;
    }

    const courseID = courseMatch[1];
    const teacher = courseMatch[2];
    coursesMap.set(courseID, { courseID, teacher });  // 🟢 sofort setzen

    for (const studentDir of studentDirs) {
      const studentPath = path.join(coursePath, studentDir);
      const zipFile = path.join(studentPath, "download.zip");

      try {
        const statZip = await stat(zipFile);
        if (!statZip.isFile()) continue;
      } catch {
        continue;
      }

      const title = studentDir.replace(/_/g, " ").replace(/\b(\w)/g, c => c.toUpperCase());
      const downloadUrl = `/pygames/${courseFolder}/${studentDir}/download.zip`;

      games.push({ courseID, teacher, title, downloadUrl });
    }
  }

  return {
    games,
    courses: Array.from(coursesMap.values()).sort((a, b) => a.courseID.localeCompare(b.courseID)),
  };
}

async function writeOutputFile(dir, filename, data) {
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Wrote ${fullPath}`);
}

async function ensureOutputDirs() {
  await mkdir(websitesOutputDir, { recursive: true });
  await mkdir(gamesOutputDir, { recursive: true });
}

async function main() {
  await ensureOutputDirs();

  const { links, courses: websiteCourses } = await generateStudentPagesLinks();
  const { games, courses: gameCourses } = await generateGameLinks();

  // 📂 Write website files
  await writeOutputFile(websitesOutputDir, "links.json", links);
  await writeOutputFile(websitesOutputDir, "courses.json", websiteCourses);

  // 📂 Write game files
  await writeOutputFile(gamesOutputDir, "games.json", games);
  await writeOutputFile(gamesOutputDir, "courses.json", gameCourses);
}

main().catch(console.error);