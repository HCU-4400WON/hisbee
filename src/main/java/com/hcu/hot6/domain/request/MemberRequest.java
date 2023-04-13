package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.Department;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class MemberRequest {

    @NotNull
    private String nickname;

    @NotNull
    private Boolean isPublic;

    private String bio;
    private Department department;
    private String grade;
    private String contact;
    private List<String> club;
    private List<String> externalLinks;
    private String pictureUrl;
}
