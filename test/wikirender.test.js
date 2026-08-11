import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInline } from '../site/md.js';
import { wikiUrl, wikiFile, inlineToHtml } from '../site/render.js';

// 있는 문서만 넘겨주는 ctx. 실제 빌드에서는 wiki/ 폴더를 훑어 만든다.
const ctxOf = (names) => ({
  base: '',
  urlOf: () => null,
  wikiUrlOf: (name) => (names.includes(name) ? wikiUrl(name) : null),
});

// 뒤에 슬래시도 .html 도 붙이지 않는다. GitHub Pages 가 <이름>.html 을 그대로 내준다.
test('문서 이름이 그대로 URL 이 된다', () => {
  assert.equal(wikiUrl('ExtremeProgramming'), 'ExtremeProgramming');
});

test('한글 문서 이름은 URL 로 인코딩된다', () => {
  assert.equal(wikiUrl('테스트주도개발'), encodeURIComponent('테스트주도개발'));
});

test('실제로 쓰이는 파일은 <이름>.html 이다', () => {
  assert.equal(wikiFile('테스트주도개발'), '테스트주도개발.html');
});

test('있는 문서로의 [[링크]] 는 링크가 된다', () => {
  const html = inlineToHtml(parseInline('[[ExtremeProgramming]]', 'wiki/a.md'), ctxOf(['ExtremeProgramming']));
  assert.match(html, /<a class="wiki" href="ExtremeProgramming">ExtremeProgramming<\/a>/);
});

// 없는 문서로 링크하는 것이 위키에서는 정상이다 — 다음에 쓸 문서를 가리킨다.
test('없는 문서로의 [[링크]] 는 아직 없음 표시가 된다', () => {
  const html = inlineToHtml(parseInline('[[아직없는문서]]', 'wiki/a.md'), ctxOf([]));
  assert.match(html, /class="wiki new"/);
  assert.match(html, /아직없는문서/);
});

test('[[이름|글자]] 는 글자를 보여주고 이름으로 간다', () => {
  const html = inlineToHtml(parseInline('[[ExtremeProgramming|XP]]', 'wiki/a.md'), ctxOf(['ExtremeProgramming']));
  assert.match(html, /href="ExtremeProgramming">XP</);
});

test('CamelCase 는 문서가 있을 때만 링크가 된다', () => {
  const nodes = parseInline('ExtremeProgramming 과 KentBeck', 'wiki/a.md');
  const html = inlineToHtml(nodes, ctxOf(['ExtremeProgramming']));
  assert.match(html, /<a class="wiki" href="ExtremeProgramming">/);
  assert.doesNotMatch(html, /KentBeck<\/a>/);
  assert.match(html, /KentBeck/);
});

