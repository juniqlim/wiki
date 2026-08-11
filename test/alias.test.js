import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNote } from '../site/md.js';
import { renderRedirect } from '../site/render.js';

test('aliases 를 쉼표로 적으면 여러 개가 된다', () => {
  const doc = parseNote('wiki/a.md', '---\naliases: 옛이름, 더옛이름\n---\n본문');
  assert.deepEqual(doc.aliases, ['옛이름', '더옛이름']);
});

test('aliases 가 없으면 빈 목록이다', () => {
  assert.deepEqual(parseNote('wiki/a.md', '본문').aliases, []);
});

// 옛 이름으로 나간 링크가 죽지 않게 새 주소로 보낸다. 정본은 하나로 둔다.
test('옛 이름 페이지는 새 주소로 보낸다', () => {
  const html = renderRedirect('NewName');
  assert.match(html, /<meta http-equiv="refresh" content="0; url=NewName">/);
  assert.match(html, /<link rel="canonical" href="NewName">/);
  assert.match(html, /<a href="NewName">/);
});

test('한글 이름은 주소로 인코딩해 보낸다', () => {
  const html = renderRedirect('테스트주도개발');
  assert.match(html, new RegExp('url=' + encodeURIComponent('테스트주도개발')));
});
