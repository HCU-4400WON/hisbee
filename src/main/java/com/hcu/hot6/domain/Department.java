package com.hcu.hot6.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
public enum Department {
    NONE("해당없음"),
    GLS("글로벌리더십학부"),
    INT_STUDY("국제어문학부"),
    MANAGEMENT("경영경제학부"),
    LAW("법학부"),
    COMMUNICATION("커뮤니케이션학부"),
    COUNSELING("상담심리사회복지학부"),
    LIFE_SCIENCE("생명과학부"),
    SPATIAL_ENV("공간환경시스템공학부"),
    CSEE("전산전자공학부"),
    CCD("콘텐츠융합디자인학부"),
    MCE("기계제어공학부"),
    ICT("ICT창업학부"),
    CCE("창의융합교육원"),
    AI("AI융합교육원");

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
