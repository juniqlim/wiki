import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHistory } from '../site/history.js';
import { renderChanges } from '../site/render.js';

const log = `2026-01-01
A\twiki/Agile.md
2026-02-01
M\twiki/Agile.md
A\twiki/Old.md
2026-03-01
R100\twiki/Old.md\twiki/New.md
`;

test('마지막으로 고친 날을 문서별로 안다', () => {
  const h = readHistory(log);
  assert.equal(h.get('wiki/Agile.md').updated, '2026-02-01');
});

test('이름을 바꾼 문서는 새 이름이 이력을 물려받는다', () => {
  const h = readHistory(log);
  assert.equal(h.get('wiki/New.md').updated, '2026-03-01');
  assert.equal(h.has('wiki/Old.md'), false);
});

test('최근 변경은 최근 고친 문서가 위에 온다', () => {
  const html = renderChanges({
    site: { title: '위키' }, base: '',
    changes: [
      { name: 'New', title: '새 문서', updated: '2026-03-01' },
      { name: 'Agile', title: '애자일', updated: '2026-02-01' },
    ],
  });
  assert.ok(html.indexOf('New') < html.indexOf('Agile'));
  assert.match(html, /2026-03-01/);
  assert.match(html, /애자일/);
});
