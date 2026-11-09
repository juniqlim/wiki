import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderIndex } from '../site/render.js';

// 이 사이트는 juniq.im 에서 온다. 온 길로 돌아갈 수 있어야 한다.
test('머리말에 홈으로 돌아가는 링크가 있다', () => {
  const html = renderIndex({ site: { title: '나의 위키' }, docs: [], base: '' });

  assert.match(html, /<a class="home" href="https:\/\/juniq\.im\/">← juniq<\/a>/);
});

// 위키는 원래 계속 고치는 곳이다. 첫 화면에 그걸 알리는 문구를 두지 않는다.
test('첫 화면에 소개 문구가 없다', () => {
  const html = renderIndex({ site: { title: '나의 위키', tagline: '소개 문구' }, docs: [], base: '' });

  assert.doesNotMatch(html, /class="tagline"/);
  assert.doesNotMatch(html, /소개 문구/);
});
