import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderNotes, slugFor } from '../site/collect.js';

test('order에 적힌 순서를 그대로 지킨다', () => {
  const found = ['a/1.md', 'a/2.md', 'a/3.md'];
  assert.deepEqual(orderNotes(found, ['a/3.md', 'a/1.md', 'a/2.md']), ['a/3.md', 'a/1.md', 'a/2.md']);
});

test('order에 없는 노트는 파일명순으로 뒤에 붙는다', () => {
  const found = ['a/c.md', 'a/b.md', 'a/z.md'];
  assert.deepEqual(orderNotes(found, ['a/z.md']), ['a/z.md', 'a/b.md', 'a/c.md']);
});

test('order 없이도 전부 파일명순으로 나온다', () => {
  assert.deepEqual(orderNotes(['b.md', 'a.md']), ['a.md', 'b.md']);
});

test('order에 적혔지만 파일이 없으면 무시한다', () => {
  assert.deepEqual(orderNotes(['a.md'], ['지운노트.md', 'a.md']), ['a.md']);
});

// macOS가 readdir로 돌려주는 한글 파일명은 NFD, JSON에 적은 건 NFC라 그냥 비교하면 어긋난다.
test('한글 파일명은 정규화 형태가 달라도 order와 맞는다', () => {
  const nfd = 'investment/투자판단모델.md'.normalize('NFD');
  const nfc = 'investment/투자판단모델.md'.normalize('NFC');
  assert.deepEqual(orderNotes([nfd, 'a/b.md'], [nfc]), [nfc, 'a/b.md']);
});

test('한글 파일명은 정규화 형태가 달라도 slug를 찾는다', () => {
  const nfd = 'investment/투자판단모델.md'.normalize('NFD');
  const slugs = { 'investment/투자판단모델.md': 'investment-decision-model' };
  assert.equal(slugFor(nfd, slugs), 'investment-decision-model');
});

test('slug는 매핑에 있을 때만 나온다', () => {
  const slugs = { 'investment/투자판단모델.md': 'investment-decision-model' };
  assert.equal(slugFor('investment/투자판단모델.md', slugs), 'investment-decision-model');
  assert.equal(slugFor('programming/why-tdd.md', slugs), '');
});
