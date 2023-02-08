package com.hcu.hot6;

import com.hcu.hot6.domain.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@SpringBootTest
@ExtendWith(SpringExtension.class)
@Transactional
public class MemberTest {
    @Test
    public void 멤버_객체_생성() throws Exception{

        final Member member = Member.ByMemberBuilder()
                .email("22000123@handong.ac.kr")
                .nickname("User1")
                .isPublic(false)
                .department(Department.ICT)
                .position(Position.PLANNER)
                .bio("안녕하세요. 저는 00학번 ICT학부 000입니다.")
                .grade(2)
                .club("MIC")
                .contact("010-0000-0000")
                .externalLinks("naver.blog.000.com")
                .build();

        Assertions.assertThat(member.getEmail()).isEqualTo("22000123@handong.ac.kr");
        Assertions.assertThat(member.getNickname()).isEqualTo("User1");
        Assertions.assertThat(member.isPublic()).isEqualTo(false);
        Assertions.assertThat(member.getDepartment()).isEqualTo(Department.ICT);
        Assertions.assertThat(member.getPosition()).isEqualTo(Position.PLANNER);
        Assertions.assertThat(member.getBio()).isEqualTo("안녕하세요. 저는 00학번 ICT학부 000입니다.");
        Assertions.assertThat(member.getGrade()).isEqualTo(2);
        Assertions.assertThat(member.getClub()).isEqualTo("MIC");
        Assertions.assertThat(member.getContact()).isEqualTo("010-0000-0000");
        Assertions.assertThat(member.getExternalLinks()).isEqualTo("naver.blog.000.com");

    }
}
