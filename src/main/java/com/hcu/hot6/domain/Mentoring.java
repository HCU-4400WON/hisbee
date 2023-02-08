package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("M")
public class Mentoring extends Post{

    private int maxMentor;
    private int maxMentee;

    private int currMentor;
    private int currMentee;

    private boolean hasPay;

    //=== 생성 메서드 ===//
//    public static Mentoring createMentoring(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int maxMentor, int maxMentee) {
//        Mentoring mentoring = new Mentoring();
//
//        // String 기본 정보 지정
//        mentoring.setTitle(title);
//        mentoring.setContent(content);
//        mentoring.setContact(contact);
//
//        // LocalDateTime 지정
//        mentoring.getPeriod().setPostStart(LocalDateTime.now());
//        mentoring.getPeriod().setPostEnd(postEnd);
//        mentoring.getPeriod().setProjectStart(projectStart);
//        mentoring.getPeriod().setProjectEnd(projectEnd);
//
//        // Total 계산 및 지정
//        mentoring.setTotal(maxMentor + maxMentee);
//
//        // initial value : isCompleted = false
//        mentoring.setCompleted(false);
//
//        // Author 양방향 매핑
//        mentoring.registerAuthor(author);
//
//        // Mentoring 멤버 변수 지정
//        mentoring.setMaxMentor(maxMentor);
//        mentoring.setMaxMentee(maxMentee);
//        mentoring.setCurrMentor(0);
//        mentoring.setCurrMentee(0);
//
//        return mentoring;
//    }

    //=== Builder 사용해서 리팩토링 해보기 ===//
    public Mentoring(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int maxMentor, int maxMentee, boolean hasPay, int total){
        super(title, content, contact, author, total);

        Assert.hasText(title, "멘토링의 모집멘토인원(maxMentor)은 필수 입력사항입니다.");
        Assert.hasText(contact, "멘토링의 모집멘티인원(maxMentee)은 필수 입력사항입니다.");
        Assert.hasText(contact, "멘토링의 보수유무(hasPay)은 필수 입력사항입니다.");

        this.maxMentor = maxMentor;
        this.maxMentee = maxMentee;
        this.hasPay = hasPay;
    }
}
