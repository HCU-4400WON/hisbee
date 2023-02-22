package com.hcu.hot6.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Position {
    ORDINARY("일반"),
    PLANNER("기획자"),
    DESIGNER("디자이너"),
    DEVELOPER("개발자");

    private final String name;
}
