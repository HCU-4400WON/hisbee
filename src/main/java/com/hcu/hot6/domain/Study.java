package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@DiscriminatorValue("S")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Study extends Post {

    private int maxMember;
    private int currMember;


    //=== 생성 메서드 ===//
    public static Study createStudy(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int maxMember) {
        Study study = new Study();

        // String 기본 정보 지정
        study.setTitle(title);
        study.setContent(content);
        study.setContact(contact);

        // LocalDateTime 지정
        study.setPostStart(LocalDateTime.now());
        study.setPostEnd(postEnd);
        study.setProjectStart(projectStart);
        study.setProjectEnd(projectEnd);

        // Total 계산 및 지정
        study.setTotal(maxMember);

        // initial value : isCompleted = false
        study.setCompleted(false);

        // Author 양방향 매핑
        study.registerAuthor(author);

        // Study 멤버 변수 지정
        study.setMaxMember(maxMember);
        study.setCurrMember(0);

        return study;
    }
}
