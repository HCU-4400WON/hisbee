package com.hcu.hot6.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("M")
public class Mentoring extends Post{

    @NotNull
    private int maxMentor;
    @NotNull
    private int maxMentee;

    @Column(nullable = false)
    private int currMentor;
    @Column(nullable = false)
    private int currMentee;

    @NotNull
    private boolean hasPay;

    //=== 생성 메서드 ===//
    public Mentoring(String title, String content, String contact, Member author, int maxMentor, int maxMentee, boolean hasPay, int total){
        super(title, content, contact, author, total);

        Assert.notNull(maxMentor, "멘토링의 멘토모집인원(maxMentor)은 필수 입력사항입니다.");
        Assert.notNull(maxMentee, "멘토링의 멘티모집인원(maxMentee)은 필수 입력사항입니다.");
        Assert.notNull(hasPay, "멘토링의 보수여부(hasPay)은 필수 입력사항입니다.");

        this.maxMentor = maxMentor;
        this.maxMentee = maxMentee;

        this.currMentor = 0;
        this.currMentee = 0;

        this.hasPay = hasPay;
    }
}
