package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@DiscriminatorValue("M")
public class Mentoring extends Post{

    private int maxMentor;
    private int maxMentee;

    private int currMentor;
    private int currMentee;

    private boolean hasPay;

    //=== 생성 메서드 ===//
    public static Mentoring createMentoring(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int maxMentor, int maxMentee) {
        Mentoring mentoring = new Mentoring();

        // String 기본 정보 지정
        mentoring.setTitle(title);
        mentoring.setContent(content);
        mentoring.setContact(contact);

        // LocalDateTime 지정
        mentoring.getPeriod().setPostStart(LocalDateTime.now());
        mentoring.getPeriod().setPostEnd(postEnd);
        mentoring.getPeriod().setProjectStart(projectStart);
        mentoring.getPeriod().setProjectEnd(projectEnd);

        // Total 계산 및 지정
        mentoring.setTotal(maxMentor + maxMentee);

        // initial value : isCompleted = false
        mentoring.setCompleted(false);

        // Author 양방향 매핑
        mentoring.registerAuthor(author);

        // Mentoring 멤버 변수 지정
        mentoring.setMaxMentor(maxMentor);
        mentoring.setMaxMentee(maxMentee);
        mentoring.setCurrMentor(0);
        mentoring.setCurrMentee(0);

        return mentoring;
    }
}
