#!/usr/bin/env node
// Scans the /projects folder and writes assets/projects.json.
//
// Each direct subfolder of /projects becomes one project. The folder name
// becomes the title (dashes/underscores turned into spaces, title-cased).
// Any images/videos directly inside that folder become its gallery; the
// first image (alphabetically) is used as the thumbnail. Projects are
// sorted newest-first, based on the most recently modified file in each
// folder.
//
// Run with: node scripts/build-projects-manifest.mjs
// This also runs automatically via .github/workflows/build-projects.yml
// whenever something changes under projects/.

import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PROJECTS_DIR = join(ROOT, 'projects');
const OUTPUT_FILE = join(ROOT, 'assets', 'projects.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const IGNORE_FILES = new Set(['.DS_Store', 'Thumbs.db', '.gitkeep']);

function titleCase(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function encodePath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function classify(filename) {
  const ext = extname(filename).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (VIDEO_EXTS.has(ext)) return 'video';
  return null;
}

function buildProject(folderName) {
  const folderPath = join(PROJECTS_DIR, folderName);
  const entries = readdirSync(folderPath, { withFileTypes: true })
    .filter((e) => e.isFile() && !IGNORE_FILES.has(e.name) && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  let latestMtime = statSync(folderPath).mtimeMs;
  const media = [];

  for (const name of entries) {
    const type = classify(name);
    if (!type) continue; // skip README.txt, manifest notes, etc.
    const filePath = join(folderPath, name);
    const mtime = statSync(filePath).mtimeMs;
    if (mtime > latestMtime) latestMtime = mtime;

    const relPath = relative(ROOT, filePath).split('\\').join('/');
    media.push({ type, src: encodePath(relPath), name });
  }

  const firstImage = media.find((m) => m.type === 'image');

  return {
    slug: folderName,
    title: titleCase(folderName),
    thumbnail: firstImage ? firstImage.src : null,
    media: media.map(({ type, src }) => ({ type, src })),
    updatedAt: new Date(latestMtime).toISOString(),
  };
}

function main() {
  mkdirSync(join(ROOT, 'assets'), { recursive: true });

  let folders = [];
  try {
    folders = readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => e.name);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  const projects = folders
    .map(buildProject)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2) + '\n');

  console.log(`Wrote ${projects.length} project(s) to ${relative(ROOT, OUTPUT_FILE)}`);
  for (const p of projects) {
    console.log(`  - ${p.slug}: ${p.media.length} file(s)${p.thumbnail ? '' : ' (no image thumbnail)'}`);
  }
}

main();
