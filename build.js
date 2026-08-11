#!/usr/bin/env node
// md → docs/ 정적 사이트. 의존성 없음. 실행: node build.js
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNote, blocksToText } from './site/md.js';
import { renderWikiDoc, renderIndex, renderRedirect, wikiUrl, wikiFile } from './site/render.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'docs');

const cfg = JSON.parse(await readFile(path.join(root, 'site.json'), 'utf8'));

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

// 백링크 + 아직 쓰지 않은 문서
const back = new Map();
const wanted = new Map();
for (const d of docs) {
  for (const target of d.wikiLinks) {
    const t = target.normalize('NFC');
    if (docNames.has(t)) {
      if (!back.has(t)) back.set(t, []);
      if (!back.get(t).includes(d.name)) back.get(t).push(d.name);
    } else if (d.wikiCalls.includes(target)) {
      if (!wanted.has(t)) wanted.set(t, []);
      if (!wanted.get(t).includes(d.name)) wanted.get(t).push(d.name);
    }
  }
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const write = async (rel, html) => {
  const dest = path.join(out, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, html, 'utf8');
};

for (const doc of docs) {
  const ctx = { base: '', urlOf: () => null, wikiUrlOf };
  await write(wikiFile(doc.name), renderWikiDoc({
    site: cfg.site, doc, ctx, base: '',
    backlinks: back.get(doc.name) || [],
    outgoing: doc.wikiLinks,
  }));
}

for (const [alias, name] of aliasTo) await write(wikiFile(alias), renderRedirect(wikiUrl(name), name));

// 노트는 여기 있다가 제 사이트로 나갔다. 그때 주소로 나간 링크를 살려 둔다.
const moved = cfg.moved || { to: '', paths: [] };
for (const p of moved.paths) await write(p, renderRedirect(moved.to + p, moved.label));

// 노트가 있던 시절의 두 페이지. 위키 목록은 첫 화면이 되었고, 최근 변경은 노트의 것이었다.
for (const p of ['wiki.html', 'changes.html']) await write(p, renderRedirect('index.html', cfg.site.title));

await write('index.html', renderIndex({
  site: cfg.site, docs, base: '',
  wanted: [...wanted.entries()].map(([name, from]) => ({ name, from })).sort((a, b) => a.name.localeCompare(b.name, 'ko')),
}));

// 검색 색인
await write('search.json', JSON.stringify(docs.map((d) => ({
  url: wikiUrl(d.name),
  title: d.name,
  folder: '위키',
  summary: d.summary,
  text: d.text.replace(/\s+/g, ' ').slice(0, 4000),
}))));

await cp(path.join(root, 'site/style.css'), path.join(out, 'style.css'));
await cp(path.join(root, 'site/app.js'), path.join(out, 'app.js'));

// 빌드가 docs/를 지우므로 Pages 커스텀 도메인 표시를 매번 다시 쓴다.
if (cfg.site.domain) await writeFile(path.join(out, 'CNAME'), cfg.site.domain + '\n');

console.log('docs/ 생성 완료 — 위키 ' + docs.length + '편'
  + (aliasTo.size ? ', 옛 이름 ' + aliasTo.size + '개' : '')
  + (moved.paths.length ? ', 옮긴 노트 ' + moved.paths.length + '개' : '')
  + (wanted.size ? ', 아직 쓰지 않은 문서 ' + wanted.size + '개' : ''));
