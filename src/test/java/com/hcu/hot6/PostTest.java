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
public class PostTest {

    @Test
    public void 기간_객체_생성() throws Exception{
        final Period period = Period.ByPeriodBuilder()
                .build();

        Assertions.assertThat(period.getPostEnd()).isEqualTo(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        Assertions.assertThat(period.getProjectStart()).isEqualTo(LocalDateTime.of(2023, 3, 3, 0, 0, 0));
    }

    public Member createMember(){
        return Member.ByMemberBuilder()
                .email("22000123@handong.ac.kr")
                .nickname("User1")
                .isPublic(false)
                .department(Department.ICT)
                .bio("안녕하세요. 저는 00학번 ICT학부 000입니다.")
                .grade("2학년")
                .club("MIC")
                .contact("010-0000-0000")
                .externalLinks("naver.blog.000.com")
                .build();
    }


}
