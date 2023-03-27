package com.hcu.hot6.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
public enum Duration {
    TBD("미정"),
    SHORT("1개월 이하"),
    SPRING("봄학기"), FALL("가을학기"),
    SUMMER("여름방학"), WINTER("겨울방학"),
    LONG("1년 이상");

    private final String kor;

    @JsonCreator
    public static Duration from(String code) {
        return Arrays.stream(Duration.values())
                .filter(dur -> dur.kor.equals(code))
                .findFirst()
                .orElseThrow();
    }

    @JsonValue
    public String getKor() {
        return kor;
    }
}
