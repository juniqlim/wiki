---
title: 객체지향
aliases: OO, OOP
---
> 60년대에 그 용어를 너무 가볍게 정했습니다. "메시지 지향(message oriented)" 같은 것을 골랐어야 했습니다.
>
> — [앨런 케이, 2011년](https://note.juniq.im/notes/programming/alan/2023-03-17-alan-kay-oop.html)

앨런 케이가 1966년 "객체 지향 프로그래밍"이라는 이름을 만들었다. 지금 흔히 객체지향이라 부르는 것과 그가 뜻한 것은 다르다.

## 흔히 아는 객체지향

클래스로 데이터와 그 데이터를 다루는 함수를 묶는다. 보통 캡슐화, 상속, 다형성, 추상화 넷을 꼽는다. C++와 자바로 주류가 됐다.

뿌리는 두 갈래다. 시뮬라(Simula, 1967)가 클래스, 객체, 상속을 처음 넣었다. 추상 데이터 타입(abstract data type) 연구는 데이터 구조를 감추고 연산만 공개하는 방식을 줬다. 앨런 케이도 [추상 데이터 타입 갈래가 훨씬 더 많은 주목을 받았다](https://note.juniq.im/notes/programming/alan/2023-03-17-alan-kay-oop.html)고 했다.

## 앨런 케이는 객체지향을 왜 만들었나

> 1966년 11월에 저를 강타한 생각은 터무니없을 정도로 단순했습니다. "서로 통신할 수 있는 컴퓨터가 충분히 있다면, 컴퓨터로 할 수 있는 그 어떤 것이든 정의하는 데 이것만 있으면 된다."
>
> — [앨런 케이, 2020년](https://note.juniq.im/notes/programming/alan/alan-what-thought-process-would-lead-one-to-invent-object-oriented-programming.html)

- 프로세스들의 시스템을 쉽게 정의하고 싶었다. 어떤 종류의 프로세스로 된 어떤 종류의 시스템이든.
- 프로시저와 데이터 구조를 구성 요소로 쓰는 것보다 확장이 잘 되고, 깔끔하고, 시스템 전체를 설계하기 좋았다.
- 데이터의 추한 속성을 고치는 데서 그치지 않고 없앨 수 있었다. 그는 "데이터라는 아이디어는 항상 좋지 않았다"고 했다.

## 앨런 케이의 객체지향

> 오래전에 이 주제에 '객체(objects)'라는 용어를 만든 것이 유감입니다. 많은 사람이 더 작은 아이디어에 집중하게 만들었기 때문입니다. 큰 아이디어는 '메시징(messaging)'입니다.
>
> — [앨런 케이, 1998년](https://note.juniq.im/notes/programming/alan/2023-03-17-alan-kay-oop.html)

> 저에게 OOP는 오직 메시징, 상태-프로세스의 지역 보존·보호·은닉, 모든 것의 극단적인 늦은 바인딩(late-binding)입니다.
>
> — [앨런 케이, 2003년](https://note.juniq.im/notes/programming/alan/2023-03-17-alan-kay-oop.html)

- 객체는 서로 메시지를 주고받는 컴퓨터다. 생물학의 세포, 네트워크의 컴퓨터와 닮았다.
- 명령(setter)이 아니라 목표를 요청한다. 그러면 캡슐화와 느슨한 결합이 저절로 따라온다.
- 상속 대신 위임을 썼다. '다형성'은 그들이 만든 말이 아니고, generic messages라 불렀다([댓글 모음](https://note.juniq.im/notes/programming/alan/2023-06-01-alan's-comment-in-alan-wrong-article.html)).
- 스몰토크와 LISP에서 가능하다고 했다.

## 둘의 차이

흔한 객체지향은 데이터 구조와 프로시저를 클래스로 묶은 것에 가깝다. 앨런 케이는 바로 그 데이터 구조와 프로시저를 없애려고 객체를 썼다.

갈림길은 명령이냐 요청이냐다. 앨런 케이의 [댓글](https://note.juniq.im/notes/programming/alan/2023-06-01-alan's-comment-in-alan-wrong-article.html)을 모아 보면, 비슷한 뜻으로 쓰이는 말이 두 묶음으로 나뉜다.

- 명령: setter, 데이터, 추상 데이터 타입, 구조체와 프로시저, 대입문, 전통적 프로그래밍
- 요청(선언): 메시징, 서비스, 캡슐화, 느슨한 결합, 객체, 모듈

앨런 케이가 직접 꼽은 예는 setter다. setter는 어떤 객체든 누구나 명령으로 주무를 수 있는 데이터 구조로 되돌린다.

[자바에 적용해 본 것](https://note.juniq.im/notes/programming/alan/2023-06-06-alan's-oop-practices-in-java.html): setter 금지, 인스턴스 필드는 final, 공개 메서드의 요청과 응답을 단순하게.
