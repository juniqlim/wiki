#!/usr/bin/env node
// md → dist/ 정적 사이트. 의존성 없음. 실행: node build.js
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNote, blocksToText } from './site/md.js';
import { orderNotes, slugFor } from './site/collect.js';
import { renderHome, renderChanges, renderNote, noteUrl } from './site/render.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');

const cfg = JSON.parse(await readFile(path.join(root, 'site.json'), 'utf8'));
const labelOf = (dir) => (cfg.folders.find((f) => f.dir === dir) || {}).label || dir;

// 폴더를 훑어 md를 모은다 — 목록을 손으로 관리하지 않는다.
const found = [];
for (const f of cfg.folders) {
  const dir = path.join(root, f.dir);
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.md')) found.push(f.dir + '/' + e.name);
  }
}

const notes = [];
for (const p of orderNotes(found, cfg.order)) {
  const note = parseNote(p, await readFile(path.join(root, p), 'utf8'));
  note.slug = slugFor(p, cfg.slugs) || note.meta.slug || '';
  note.text = blocksToText(note.blocks);
  notes.push(note);
}

// 백링크
const back = new Map();
for (const n of notes) {
  for (const t of n.links) {
    if (!back.has(t)) back.set(t, []);
    if (!back.get(t).includes(n.path)) back.get(t).push(n.path);
  }
}
const known = new Set(notes.map((n) => n.path));
for (const n of notes) n.backlinks = (back.get(n.path) || []).filter((p) => known.has(p));

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const write = async (rel, html) => {
  const dest = path.join(out, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, html, 'utf8');
};

await write('index.html', renderHome({ site: cfg.site, folders: cfg.folders, notes, base: '' }));
await write('changes.html', renderChanges({ site: cfg.site, notes, labelOf, base: '' }));

for (const note of notes) {
  const rel = decodeURIComponent(noteUrl(note));
  const base = '../'.repeat(rel.split('/').length - 1);
  await write(rel, renderNote({ site: cfg.site, note, notes, labelOf, base }));
}

// 검색 색인
const index = notes.map((n) => ({
  url: noteUrl(n),
  title: n.title,
  folder: labelOf(n.folder),
  summary: n.summary,
  text: n.text.replace(/\s+/g, ' ').slice(0, 4000),
}));
await write('search.json', JSON.stringify(index));

await cp(path.join(root, 'site/style.css'), path.join(out, 'style.css'));
await cp(path.join(root, 'site/app.js'), path.join(out, 'app.js'));

console.log('dist/ 생성 완료 — 노트 ' + notes.length + '편, 페이지 ' + (notes.length + 2) + '개');
