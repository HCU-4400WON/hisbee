package com.hcu.hot6.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Null;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("S")
public class Study extends Post {

    @NotNull
    private int maxMember;

    @Column(nullable = false)
    private int currMember;

    //=== 생성 메서드 ===//
    public Study(String title, String content, String contact, Member author, int maxMember){
        super(title, content, contact, author, maxMember);

        Assert.notNull(maxMember, "스터디의 모집인원(maxMember)은 필수 입력사항입니다.");

        this.maxMember = maxMember;

        this.currMember = 0;
    }
}
