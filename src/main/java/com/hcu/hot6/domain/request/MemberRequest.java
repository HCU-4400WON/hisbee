package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Position;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Builder
@Getter
public class MemberRequest {
    @NotNull
    private final String nickname;

    @NotNull
    private final Boolean isPublic;

    private final String bio;
    private final Department department = Department.NONE;
    private final Position position = Position.NONE;
    private final Integer grade;
    private final String contact;
    private final List<String> club = new ArrayList<>();
    private final List<String> externalLinks = new ArrayList<>();

}
