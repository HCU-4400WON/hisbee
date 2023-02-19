package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Position;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class MemberRequest {

    private final String nickname;

    private final Boolean isPublic;

    private final String bio;
    private final Department department;
    private final Position position;
    private final String grade;
    private final String contact;
    private final List<String> club;
    private final List<String> externalLinks;

}
