package com.hcu.hot6.domain.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Year {
    FRESHMAN("1학년"),
    SOPHOMORE("2학년"),
    JUNIOR("3학년"),
    SENIOR("4학년"),
    NINTH("9학기이상");

    private final String name;

    public String toKor() {
        return name;
    }
}
