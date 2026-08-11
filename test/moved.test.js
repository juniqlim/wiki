import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderRedirect, wikiUrl } from '../site/render.js';

// 노트는 note.juniq.im 으로 나갔다. 여기 있던 주소로 나간 링크는 죽으면 안 된다.
test('옮긴 노트는 새 사이트의 주소로 보낸다', () => {
  const html = renderRedirect('https://note.juniq.im/notes/programming/why-tdd.html', 'note.juniq.im');
  assert.match(html, /content="0; url=https:\/\/note\.juniq\.im\/notes\/programming\/why-tdd\.html"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/note\.juniq\.im\/notes\/programming\/why-tdd\.html">/);
  assert.match(html, />note\.juniq\.im</);
});

// 이름을 바꾼 위키 문서도 같은 장치를 쓴다.
test('옛 이름은 새 이름으로 보낸다', () => {
  const html = renderRedirect(wikiUrl('NewName'), 'NewName');
  assert.match(html, /content="0; url=NewName"/);
});

test('한글 이름은 주소로 인코딩해 보낸다', () => {
  const html = renderRedirect(wikiUrl('테스트주도개발'), '테스트주도개발');
  assert.match(html, new RegExp('url=' + encodeURIComponent('테스트주도개발')));
});
