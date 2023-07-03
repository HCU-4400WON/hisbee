package com.hcu.hot6.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PostTypeDetails {
    PLANNER(PostType.PROJECT),
    DESIGNER(PostType.PROJECT),
    DEVELOPER(PostType.PROJECT),
    MENTOR(PostType.MENTORING),
    MENTEE(PostType.MENTORING),
    MEMBER(PostType.STUDY);

    private final PostType type;
}
