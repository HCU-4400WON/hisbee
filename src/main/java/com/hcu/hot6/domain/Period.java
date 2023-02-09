package com.hcu.hot6.domain;

import jakarta.persistence.Embeddable;
import lombok.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
public class Period {

    @NotNull
    private LocalDateTime postStart;
    @NotNull
    private LocalDateTime postEnd;
    @NotNull
    private LocalDateTime projectStart;
    @NotNull
    private LocalDateTime projectEnd;

    //=== 생성 메서드 ===//
    @Builder(builderClassName = "ByPeriodBuilder", builderMethodName = "ByPeriodBuilder")
    public Period(LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd){
        Assert.notNull(postEnd, "모집글의 게시 마감일(postEnd)은 필수 입력사항입니다.");
        Assert.notNull(projectStart, "모집글의 프로젝트 시작일(projectStart)은 필수 입력사항입니다.");
        Assert.notNull(projectEnd, "모집글의 프로젝트 마감일(projectEnd)은 필수 입력사항입니다.");

        this.postStart = LocalDateTime.now();
        this.postEnd = postEnd;
        this.projectStart = projectStart;
        this.projectEnd = projectEnd;
    }

}
