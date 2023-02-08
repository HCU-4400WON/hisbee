package com.hcu.hot6;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Mentoring;
import com.hcu.hot6.domain.Period;
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
                .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                .projectStart(LocalDateTime.of(2023, 3, 3, 0, 0, 0))
                .projectEnd(LocalDateTime.of(2023, 6, 18, 0, 0, 0))
                .build();

        Assertions.assertThat(period.getPostEnd()).isEqualTo(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        Assertions.assertThat(period.getProjectStart()).isEqualTo(LocalDateTime.of(2023, 3, 3, 0, 0, 0));
        Assertions.assertThat(period.getProjectEnd()).isEqualTo(LocalDateTime.of(2023, 6, 18, 0, 0, 0));
    }

    @Test
    public void 멘토링_객체_생성() throws Exception{
        final Member member = new Member();
        final Period period = Period.ByPeriodBuilder()
                .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                .projectStart(LocalDateTime.of(2023, 3, 3, 0, 0, 0))
                .projectEnd(LocalDateTime.of(2023, 6, 18, 0, 0, 0))
                .build();

        final Mentoring mentoring = Mentoring.builder()
                .title("앱프로그래밍 과목 멘토링 해드립니다.")
                .content("코딩을 처음 접해본 저는 앱프로그래밍 과목 들으면서 너무 어려웠어서 옆에서 도와주는 누군가가 있으면 좋겠다는 생각을 했었습니다. 멘토링을 받고싶은 분들 연락 주세요.")
                .contact("22000123@handong.ac.kr")
                .period(period)
                .author(member)
                .maxMentor(0)
                .maxMentee(3)
                .hasPay(false)
                .total(3)
                .build();

        Assertions.assertThat(mentoring.getTitle()).isEqualTo("앱프로그래밍 과목 멘토링 해드립니다.");
        Assertions.assertThat(mentoring.getContent()).isEqualTo("코딩을 처음 접해본 저는 앱프로그래밍 과목 들으면서 너무 어려웠어서 옆에서 도와주는 누군가가 있으면 좋겠다는 생각을 했었습니다. 멘토링을 받고싶은 분들 연락 주세요.");
        Assertions.assertThat(mentoring.getContact()).isEqualTo("22000123@handong.ac.kr");
        Assertions.assertThat(mentoring.getPeriod().getPostEnd()).isEqualTo(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        Assertions.assertThat(mentoring.getPeriod().getProjectStart()).isEqualTo(LocalDateTime.of(2023, 3, 3, 0, 0, 0));
        Assertions.assertThat(mentoring.getPeriod().getProjectEnd()).isEqualTo(LocalDateTime.of(2023, 6, 18, 0, 0, 0));
        Assertions.assertThat(mentoring.getAuthor()).isEqualTo(member);
        Assertions.assertThat(mentoring.getMaxMentor()).isEqualTo(0);
        Assertions.assertThat(mentoring.getMaxMentee()).isEqualTo(3);
        Assertions.assertThat(mentoring.isHasPay()).isEqualTo(false);
        Assertions.assertThat(mentoring.isCompleted()).isEqualTo(false);
        Assertions.assertThat(mentoring.getTotal()).isEqualTo(3);
    }


}
