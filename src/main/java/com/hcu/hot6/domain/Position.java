package com.hcu.hot6.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
public enum Position {
    ORDINARY("일반"),
    PLANNER("기획자"),
    DESIGNER("디자이너"),
    DEVELOPER("개발자");

    private final String name;

    @JsonCreator
    public static Department from(String property) {
        return Arrays.stream(Department.values())
                .filter(value -> value.getName().equals(property))
                .findFirst()
                .orElseThrow();
    }

    @JsonValue
    public String getName() {
        return name;
    }
}
