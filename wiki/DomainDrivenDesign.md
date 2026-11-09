---
title: 도메인 주도 설계
aliases: DDD
---
비즈니스 사람과 공통언어로 소통하여 만든 모델을, 코드로 직결하는 것. 그러면서 학습하고 모델을 바꾸고 비즈니스 사람과 소통한다.

---

이 책의 교훈 두 가지는

- 개념과 구현을 분리하지 마라.
- 설계와 구현을 분리하지 마라.

[마틴 파울러가 추천사](https://note.juniq.im/notes/programming/ddd-book-excerpts.html)에서 한 말.

에반스가 머리말에서 핵심으로 꼽은 장(2, 3, 9, 14장) 중 2장 유비쿼터스 언어와 3장 모델 주도 설계를 위 두 문장이 담는다. 나머지는

- 9장 암시적인 개념을 명확하게(Making Implicit Concepts Explicit): 숨은 개념을 드러내라.
- 14장 모델의 무결성 유지(Maintaining Model Integrity): 모델이 통하는 경계를 정하라.

---

에릭 에반스가 2003년 책 『도메인 주도 설계』로 이름 붙인 설계 방식. 소프트웨어 구조를 도메인에 대한 이해와 맞춘다.

도메인을 어떻게 생각하고, 어떤 언어로 말하고, 나아지는 이해를 반영하도록 소프트웨어를 어떻게 구성할지에 관한 것이다. 이해는 프로젝트 끝에서도 생기므로 리팩터링이 큰 몫을 한다([랄프 존슨](https://note.juniq.im/notes/programming/2023-03-02-ddd-book-praise-for-translation.html)). 워드의 [부채 은유](https://note.juniq.im/notes/programming/ward/ward-debt-metaphor.html)와 같은 이야기다.

에반스는 [[ExtremeProgramming|XP]]의 지지자였고 DDD를 XP의 자연스러운 구성요소로 봤다. 책의 전략적 설계 내내 반복 주기, 도메인 전문가와 함께하는 팀, 지속적 통합, 리팩터링이 나온다.

[마틴 파울러](https://martinfowler.com/bliki/DomainDrivenDesign.html)는 특히 중요한 부분으로 [전략적 설계](https://note.juniq.im/notes/programming/2023-02-05-ddd-strategic-design-summary.html)를 꼽는다. 큰 도메인을 바운디드 컨텍스트(bounded context)들의 관계로 나누는 것이다.

워드 커닝햄은 책의 리뷰어였다. 엔티티, 밸류 오브젝트 같은 전술적 패턴은 핵심이 아니니 부록으로 옮기라고 조언했다. 반대로 리팩터링을 잘하면 하나의 언어로 충분하다고 믿어 바운디드 컨텍스트는 무시했는데, 훗날 [에릭이 맞았다고 인정했다](https://note.juniq.im/notes/programming/ward/ward-observation-of-emergent-schema.html).

> 객체지향 프로그래밍에 쏟은 노력에 비해 가치를 얻지 못한다고 생각한다면 이 책에서 여러분이 잊고 행하지 않은 것이 무엇인지 찾을 수 있을 것이다.
>
> — 워드 커닝햄, 책 추천사
