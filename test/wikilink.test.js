import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInline, parseNote } from '../site/md.js';

const wikis = (nodes) => nodes.filter((n) => n.t === 'wiki');

test('[[이름]] 은 위키 링크가 된다', () => {
  const nodes = parseInline('앞 [[테스트주도개발]] 뒤', 'wiki/a.md');
  assert.deepEqual(wikis(nodes).map((n) => n.name), ['테스트주도개발']);
  assert.equal(wikis(nodes)[0].auto, false);
});

test('[[이름|글자]] 는 보이는 글자를 따로 준다', () => {
  const [w] = wikis(parseInline('[[테스트주도개발|TDD]]', 'wiki/a.md'));
  assert.equal(w.name, '테스트주도개발');
  assert.equal(w.text, 'TDD');
});

// c2 관습. 다만 오탐이 많으므로 문서가 실제 있을 때만 링크로 그린다(auto 표시).
test('CamelCase 낱말은 자동 위키워드로 잡힌다', () => {
  const [w] = wikis(parseInline('켄트벡은 ExtremeProgramming 을 만들었다', 'wiki/a.md'));
  assert.equal(w.name, 'ExtremeProgramming');
  assert.equal(w.auto, true);
});

test('낱말 하나로 된 대문자 낱말은 위키워드가 아니다', () => {
  assert.deepEqual(wikis(parseInline('Java 와 TDD 는 아니다', 'wiki/a.md')), []);
});

test('코드 안의 CamelCase 는 잡지 않는다', () => {
  assert.deepEqual(wikis(parseInline('`FooBar` 는 코드다', 'wiki/a.md')), []);
});

test('링크 글자 안의 CamelCase 는 잡지 않는다', () => {
  assert.deepEqual(wikis(parseInline('[FooBar](https://example.com)', 'wiki/a.md')), []);
});

test('URL 안의 CamelCase 는 잡지 않는다', () => {
  assert.deepEqual(wikis(parseInline('https://wiki.c2.com/?KentBeck', 'wiki/a.md')), []);
});

// 자동 CamelCase 는 우연일 수 있으니 '앞으로 쓸 문서' 로 세지 않는다.
test('쓸 문서로 세는 것은 [[ ]] 로 부른 것뿐이다', () => {
  const doc = parseNote('wiki/a.md', '[[아직없는문서]] 와 CamelCase 낱말');
  assert.deepEqual(doc.wikiLinks, ['아직없는문서', 'CamelCase']);
  assert.deepEqual(doc.wikiCalls, ['아직없는문서']);
});
