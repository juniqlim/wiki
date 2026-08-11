import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNote } from '../site/md.js';

test('aliases 를 쉼표로 적으면 여러 개가 된다', () => {
  const doc = parseNote('wiki/a.md', '---\naliases: 옛이름, 더옛이름\n---\n본문');
  assert.deepEqual(doc.aliases, ['옛이름', '더옛이름']);
});

test('aliases 가 없으면 빈 목록이다', () => {
  assert.deepEqual(parseNote('wiki/a.md', '본문').aliases, []);
});
