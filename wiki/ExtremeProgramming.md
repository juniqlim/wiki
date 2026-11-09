---
title: 익스트림 프로그래밍
aliases: XP
---
30분에 한번 운영환경에 deploy 가능한 동작하는 프로그램을 만드는 것. 그보다 더 짧아도 좋다 현재 시국에는.

---

> 저는 **나노 단위의 증분(NanoIncrements)** 이 XP의 핵심에 가깝거나, 어쩌면 그 자체라고 생각합니다. 나노 단위의 증분은 변화에 대비하기도 하지만, (우리 중 일부에게는) 놀라운 경제적 의미도 담고 있습니다. 증분이 그렇게 짧아도 여전히 경제적일 수 있다는 점입니다.
>
> — [앨리스터 코오번](https://note.juniq.im/notes/programming/ward/ward-core-of-xp.html)

> 저는 **분산되고 지속적인 설계(distributed and continuous design)** 가 XP의 핵심에 가깝다고 생각합니다. 객체(objects)로 가능해지고, 단순함(simplicity)과 짝(dual)을 이루며, 소통(communication)과 테스트(testing)라는 다른 가치들의 동기가 됩니다. 하지만 이건 제가 XP에서 가장 흥미롭게 여기는 면일 뿐입니다. (어쩌면 우리는 같은 말을 하고 있는 걸까요?)
>
> — [워드 커닝햄](https://note.juniq.im/notes/programming/ward/ward-core-of-xp.html)

켄트 벡이 1996년 크라이슬러 급여 시스템(C3) 프로젝트에서 만든 경량 방법론. [론 제프리스](https://wiki.c2.com/?TheThreeExtremos)가 코치로 함께했다. 실천의 상당수는 그전에 [워드 커닝햄](https://wiki.c2.com/?TheThreeExtremos)과 함께 다듬은 것이다.

좋다고 알려진 실천을 극단까지 밀었다.

- 코드 리뷰가 좋으면 항상 한다(짝 프로그래밍).
- 테스트가 좋으면 먼저 쓴다(테스트 주도 개발).
- 통합이 좋으면 하루에 여러 번 한다(지속적 통합).
- 짧은 주기가 좋으면 매주 배포한다.
- 설계가 좋으면 [매일 한다](https://note.juniq.im/notes/programming/ward/ward-on-design-in-xp.html)(리팩터링).

가치는 의사소통, 단순함, 피드백, 용기, 존중 다섯이다. 실천은 가치를 지키는 구체적 방법이고, 가치는 실천이 왜 그런지 설명한다.

[[Agile|애자일]] 선언의 모체 중 하나. 선언이 가치를 말한다면 XP는 실천을 말한다.

[론 제프리스의 XP 소개](https://ronjeffries.com/xprog/what-is-extreme-programming/), [계획할 것인가, 말 것인가 (워드 커닝햄 인터뷰)](https://note.juniq.im/notes/programming/ward/ward-interview-extreme.html)
