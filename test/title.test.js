import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNote } from '../site/md.js';

test('프론트매터 title 이 있으면 한글 제목이 된다', () => {
  const doc = parseNote('wiki/WardOnWiki.md', '---\ntitle: 워드가 말하는 위키\n---\n본문');
  assert.equal(doc.title, '워드가 말하는 위키');
});

test('title 이 없고 H1 도 없으면 파일 이름이 제목이다', () => {
  assert.equal(parseNote('wiki/WardOnWiki.md', '본문').title, 'WardOnWiki');
});
