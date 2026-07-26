// macOS의 readdir은 한글 파일명을 NFD로 돌려주는데 site.json에 적은 값은 NFC라
// 그냥 비교하면 어긋난다. 경로를 다룰 때는 항상 NFC로 맞춘다.
const nfc = (s) => String(s).normalize('NFC');

// 폴더에서 찾은 md 목록을 표시 순서대로 정렬한다.
// order에 적힌 것이 적힌 순서대로 앞에, 나머지는 파일명순으로 뒤에 붙는다.
// 그래서 md만 넣어도 목록에 뜨고, 순서를 고정하고 싶을 때만 order에 적으면 된다.
export function orderNotes(found, order = []) {
  const all = found.map(nfc);
  const wanted = order.map(nfc);
  const rest = all.filter((p) => !wanted.includes(p)).sort();
  return [...wanted.filter((p) => all.includes(p)), ...rest];
}

// 한글 파일명은 URL이 길어지므로 site.json의 slugs로 갈음한다.
export function slugFor(notePath, slugs = {}) {
  const key = nfc(notePath);
  const hit = Object.keys(slugs).find((k) => nfc(k) === key);
  return hit ? slugs[hit] : '';
}
