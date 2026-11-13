---
title: 테스트 주도 개발
aliases: TDD
---
구현 대상을 어떻게 사용할지 먼저 생각하는 것. [[ProblemDecomposition|문제의 분해]]가 자연발생한다. 자동화된 테스트는 덤(꼭 필요한).

---

> 저는 불안도가 높은 사람인데, 이건 마치 "프로그래머를 위한 자낙스(신경안정제)" 같았거든요. 불안을 완전히 잠재워줍니다.
>
> — [켄트 벡, 2025년](https://note.juniq.im/notes/programming/kent/canon-tdd-kent-beck.html)

> 마지막 버그 하나를 찾아내는 것이라기보다는, 세부 사항(details)에 많은 주의를 기울이지 않아도 되는 방식으로 개발을 이끌어 가는 것입니다.
>
> — [워드 커닝햄, 2003년](https://note.juniq.im/notes/programming/ward/ward-interview-tdd-infoworld-2003.html)

켄트 벡이 80년대 후반 스몰토크용 테스팅 프레임워크를 만들고, 코드-테스트 순서를 뒤집어 본 데서 나왔다. 처음엔 그도 "멍청한 생각"이라며 웃었다. [[ExtremeProgramming|XP]]의 실천 중 하나다.

## 정석 TDD (Canon TDD)

켄트 벡이 [2025년에 다시 정리한](https://note.juniq.im/notes/programming/kent/canon-tdd-kent-beck.html) 순서.

1. 시나리오 목록을 쓴다. 오늘 아는 만큼만.
2. 테스트를 하나 쓴다. 실패한다.
3. 통과시킨다. 하드코딩 같은 죄악도 괜찮다.
4. 초록인 채로 일반화한다(리팩터링).
5. 목록이 빌 때까지 2로 돌아간다.

테스트를 먼저 왕창 쓰는 것도, 코드를 다 짜고 테스트를 몰아 쓰는 것도 TDD가 아니다. 처음에 몇 개 쓰냐는 질문에 그는 "하나"라고 답했다.

## 왜 먼저 쓰나

- 코드를 짜는 그 순간이 테스트의 가치는 가장 높고 비용은 가장 낮다.
- API, 입출력, 구현 세 결정을 원하는 순서로 내리고, 매 단계 피드백을 받는다.
- 문제를 받은 순간이 가장 모르는 순간이다. 과한 설계, 일어나지 않을 시나리오, 필요할 것 같은 코드를 [안 할 수 있다](https://note.juniq.im/notes/programming/why-tdd.html).

[[ObjectOriented|객체지향]]과 닮았다. 둘 다 큰 것을 서로 얽히지 않는 작은 것들로 나누고, 그래서 뇌를 덜 쓰고 불안이 줄어든다.
