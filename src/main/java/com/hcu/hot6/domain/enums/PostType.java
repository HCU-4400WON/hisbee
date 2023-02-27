package com.hcu.hot6.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PostType {
    PROJECT("P"),
    STUDY("S"),
    MENTORING("M");

    private final String abbr;
}
