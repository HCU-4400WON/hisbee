package com.hcu.hot6;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Position;
import com.hcu.hot6.domain.request.MemberRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@ExtendWith(SpringExtension.class)
@Transactional
public class MemberTest {
    @Test
    public void 멤버_객체_생성() throws Exception {

        final Member member = Member.ByMemberBuilder()
                .email("22000123@handong.ac.kr")
                .nickname("User1")
                .isPublic(false)
                .department(Department.ICT)
                .position(Position.PLANNER)
                .bio("안녕하세요. 저는 00학번 ICT학부 000입니다.")
                .grade("2학년")
                .club("MIC")
                .contact("010-0000-0000")
                .externalLinks("naver.blog.000.com")
                .build();

        assertThat(member.getEmail()).isEqualTo("22000123@handong.ac.kr");
        assertThat(member.getNickname()).isEqualTo("User1");
        assertThat(member.isPublic()).isEqualTo(false);
        assertThat(member.getDepartment()).isEqualTo(Department.ICT);
        assertThat(member.getPosition()).isEqualTo(Position.PLANNER);
        assertThat(member.getBio()).isEqualTo("안녕하세요. 저는 00학번 ICT학부 000입니다.");
        assertThat(member.getGrade()).isEqualTo("2학년");
        assertThat(member.getClub()).isEqualTo("MIC");
        assertThat(member.getContact()).isEqualTo("010-0000-0000");
        assertThat(member.getExternalLinks()).isEqualTo("naver.blog.000.com");
    }

    @Test
    public void 프로필_수정_변경사항만_요청() throws Exception {
        // given
        Member member = Member.builder()
                .uid("uid")
                .email("test@example.com")
                .pictureUrl("url")
                .build();
        // when
        member.update(MemberRequest.builder()
                .bio("bio")
                .department(Department.CSEE)
                .build());

        member.update(MemberRequest.builder()
                .bio("bio modified")
                .build());
        // then
        assertThat(member.getEmail()).isEqualTo("test@example.com");
        assertThat(member.getDepartment()).isEqualTo(Department.CSEE);
        assertThat(member.getBio()).isEqualTo("bio modified");
        assertThat(member.getClub()).isNotNull();
    }
}
