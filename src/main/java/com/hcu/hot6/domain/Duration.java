package com.hcu.hot6.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
public enum Duration {
    TBD("미정"),
    SPRING("봄학기"), FALL("가을학기"),
    SUMMER("여름방학"), WINTER("겨울방학"),
    ONE("1학기"), TWO("2학기"),
    THREE("3학기"), FOUR("4학기"),
    LONG("1년");

    private final String kor;

    @JsonCreator
    public static Duration from(String code) {
        return Arrays.stream(Duration.values())
                .filter(dur -> dur.kor.equals(code))
                .findFirst()
                .orElseThrow();
    }

    @JsonValue
    public String toKor() {
        return kor;
    }
}
