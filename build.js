#!/usr/bin/env node
// md → docs/ 정적 사이트. 의존성 없음. 실행: node build.js
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNote, blocksToText } from './site/md.js';
import { orderNotes, slugFor } from './site/collect.js';
import { renderHome, renderChanges, renderNote, renderWikiDoc, renderWikiIndex, renderRedirect, noteUrl, wikiUrl, wikiFile } from './site/render.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'docs');

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

// 위키 문서 — 파일명이 곧 문서 이름. 폴더도 날짜도 없다.
const wikiDir = path.join(root, 'wiki');
const wikiEntries = await readdir(wikiDir, { withFileTypes: true }).catch(() => []);
const docs = [];
for (const e of wikiEntries) {
  if (!e.isFile() || !e.name.endsWith('.md')) continue;
  const name = e.name.replace(/\.md$/, '').normalize('NFC');
  const doc = parseNote('wiki/' + e.name, await readFile(path.join(wikiDir, e.name), 'utf8'));
  doc.name = name;
  doc.text = blocksToText(doc.blocks);
  docs.push(doc);
}
docs.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

const docNames = new Set(docs.map((d) => d.name));
// 옛 이름으로 불러도 본 문서로 간다. 문서 이름과 겹치는 별칭은 무시한다.
const aliasTo = new Map();
for (const d of docs) {
  for (const a of d.aliases) {
    const key = a.normalize('NFC');
    if (!docNames.has(key) && !aliasTo.has(key)) aliasTo.set(key, d.name);
  }
}
const wikiUrlOf = (name) => {
  const n = name.normalize('NFC');
  if (docNames.has(n)) return wikiUrl(n);
  return aliasTo.has(n) ? wikiUrl(aliasTo.get(n)) : null;
};

// 위키 백링크 + 아직 쓰지 않은 문서
const wikiBack = new Map();
const wanted = new Map();
for (const d of docs) {
  for (const target of d.wikiLinks) {
    const t = target.normalize('NFC');
    if (docNames.has(t)) {
      if (!wikiBack.has(t)) wikiBack.set(t, []);
      if (!wikiBack.get(t).includes(d.name)) wikiBack.get(t).push(d.name);
    } else if (d.wikiCalls.includes(target)) {
      if (!wanted.has(t)) wanted.set(t, []);
      if (!wanted.get(t).includes(d.name)) wanted.get(t).push(d.name);
    }
  }
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
  await write(rel, renderNote({ site: cfg.site, note, notes, labelOf, base, wikiUrlOf }));
}

for (const doc of docs) {
  const ctx = { base: '', urlOf: () => null, wikiUrlOf };
  await write(wikiFile(doc.name), renderWikiDoc({
    site: cfg.site, doc, ctx, base: '',
    backlinks: wikiBack.get(doc.name) || [],
    outgoing: doc.wikiLinks,
  }));
}

for (const [alias, name] of aliasTo) await write(wikiFile(alias), renderRedirect(name));

await write('wiki.html', renderWikiIndex({
  site: cfg.site, docs, base: '',
  wanted: [...wanted.entries()].map(([name, from]) => ({ name, from })).sort((a, b) => a.name.localeCompare(b.name, 'ko')),
}));

// 검색 색인
const index = notes.map((n) => ({
  url: noteUrl(n),
  title: n.title,
  folder: labelOf(n.folder),
  summary: n.summary,
  text: n.text.replace(/\s+/g, ' ').slice(0, 4000),
}));
index.push(...docs.map((d) => ({
  url: wikiUrl(d.name),
  title: d.name,
  folder: '위키',
  summary: d.summary,
  text: d.text.replace(/\s+/g, ' ').slice(0, 4000),
})));
await write('search.json', JSON.stringify(index));

await cp(path.join(root, 'site/style.css'), path.join(out, 'style.css'));
await cp(path.join(root, 'site/app.js'), path.join(out, 'app.js'));

// 빌드가 docs/를 지우므로 Pages 커스텀 도메인 표시를 매번 다시 쓴다.
if (cfg.site.domain) await writeFile(path.join(out, 'CNAME'), cfg.site.domain + '\n');

console.log('docs/ 생성 완료 — 노트 ' + notes.length + '편, 위키 ' + docs.length + '편'
  + (aliasTo.size ? ', 옛 이름 ' + aliasTo.size + '개' : '')
  + (wanted.size ? ', 아직 쓰지 않은 문서 ' + wanted.size + '개' : ''));
