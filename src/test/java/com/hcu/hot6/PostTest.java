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
        final Member member = createMember();
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

        Assertions.assertThat(mentoring.getCurrMentor()).isEqualTo(0);
        Assertions.assertThat(mentoring.getCurrMentee()).isEqualTo(0);

        Assertions.assertThat(mentoring.isHasPay()).isEqualTo(false);
        Assertions.assertThat(mentoring.isCompleted()).isEqualTo(false);
        Assertions.assertThat(mentoring.getTotal()).isEqualTo(3);
    }

    @Test
    public void 스터디_객체_생성() throws Exception{
        final Member member = createMember();
        final Period period = Period.ByPeriodBuilder()
                .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                .projectStart(LocalDateTime.of(2023, 3, 3, 0, 0, 0))
                .projectEnd(LocalDateTime.of(2023, 6, 18, 0, 0, 0))
                .build();

        final Study study = Study.builder()
                .title("토익 공부 같이 하실분 구합니다.")
                .content("전 지금 영어 많이 까먹어서 토익 몇 달 잡고 차근차근 공부해보려고 합니다. 같이 꾸준히 하실 분 연락 주세요.")
                .contact("22000123@handong.ac.kr")
                .period(period)
                .author(member)
                .maxMember(4)
                .total(4)
                .build();

        Assertions.assertThat(study.getTitle()).isEqualTo("토익 공부 같이 하실분 구합니다.");
        Assertions.assertThat(study.getContent()).isEqualTo("전 지금 영어 많이 까먹어서 토익 몇 달 잡고 차근차근 공부해보려고 합니다. 같이 꾸준히 하실 분 연락 주세요.");
        Assertions.assertThat(study.getContact()).isEqualTo("22000123@handong.ac.kr");

        Assertions.assertThat(study.getPeriod().getPostEnd()).isEqualTo(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        Assertions.assertThat(study.getPeriod().getProjectStart()).isEqualTo(LocalDateTime.of(2023, 3, 3, 0, 0, 0));
        Assertions.assertThat(study.getPeriod().getProjectEnd()).isEqualTo(LocalDateTime.of(2023, 6, 18, 0, 0, 0));

        Assertions.assertThat(study.getAuthor()).isEqualTo(member);

        Assertions.assertThat(study.getMaxMember()).isEqualTo(4);

        Assertions.assertThat(study.getCurrMember()).isEqualTo(0);

        Assertions.assertThat(study.isCompleted()).isEqualTo(false);
        Assertions.assertThat(study.getTotal()).isEqualTo(4);
    }

    @Test
    public void 프로젝트_객체_생성() throws Exception{
        final Member member = createMember();
        final Period period = Period.ByPeriodBuilder()
                .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                .projectStart(LocalDateTime.of(2023, 3, 3, 0, 0, 0))
                .projectEnd(LocalDateTime.of(2023, 6, 18, 0, 0, 0))
                .build();

        final Project project = Project.builder()
                .title("한동 소개팅 어플리케이션 서비스 만들 팀원 구합니다.")
                .content("개발자 3명, 기획자 1명, 디자이너 1명 함께 할 예정입니다. 저는 리더이자 개발자로 참여할 예정이므로 개발자 2명 모집합니다.")
                .contact("22000123@handong.ac.kr")
                .period(period)
                .author(member)
                .maxDeveloper(2)
                .maxPlanner(1)
                .maxDesigner(1)
                .hasPay(true)
                .total(4)
                .build();

        Assertions.assertThat(project.getTitle()).isEqualTo("한동 소개팅 어플리케이션 서비스 만들 팀원 구합니다.");
        Assertions.assertThat(project.getContent()).isEqualTo("개발자 3명, 기획자 1명, 디자이너 1명 함께 할 예정입니다. 저는 리더이자 개발자로 참여할 예정이므로 개발자 2명 모집합니다.");
        Assertions.assertThat(project.getContact()).isEqualTo("22000123@handong.ac.kr");

        Assertions.assertThat(project.getPeriod().getPostEnd()).isEqualTo(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        Assertions.assertThat(project.getPeriod().getProjectStart()).isEqualTo(LocalDateTime.of(2023, 3, 3, 0, 0, 0));
        Assertions.assertThat(project.getPeriod().getProjectEnd()).isEqualTo(LocalDateTime.of(2023, 6, 18, 0, 0, 0));

        Assertions.assertThat(project.getAuthor()).isEqualTo(member);

        Assertions.assertThat(project.getMaxDeveloper()).isEqualTo(2);
        Assertions.assertThat(project.getMaxPlanner()).isEqualTo(1);
        Assertions.assertThat(project.getMaxDesigner()).isEqualTo(1);

        Assertions.assertThat(project.getCurrDeveloper()).isEqualTo(0);
        Assertions.assertThat(project.getCurrPlanner()).isEqualTo(0);
        Assertions.assertThat(project.getCurrDesigner()).isEqualTo(0);

        Assertions.assertThat(project.isHasPay()).isEqualTo(true);
        Assertions.assertThat(project.isCompleted()).isEqualTo(false);
        Assertions.assertThat(project.getTotal()).isEqualTo(4);
    }

    public Member createMember(){
        return Member.ByMemberBuilder()
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
    }


}
