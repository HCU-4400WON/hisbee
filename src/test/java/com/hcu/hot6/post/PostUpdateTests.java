package com.hcu.hot6.post;

import static org.assertj.core.api.Assertions.assertThat;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.schedule.ScheduledTasks;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@ActiveProfiles("dev")
public class PostUpdateTests {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired private PostService postService;

    @Autowired private MemberRepository memberRepository;

    @Autowired private ScheduledTasks scheduledTasks;

    @PostConstruct
    void memberSetup() {
        if (isInitialised) return;

        Member member1 = Member.builder().uid("1").email(TEST_EMAIL).pictureUrl("picture").build();

        member1.update(MemberRequest.builder().nickname("member1").build());

        memberRepository.save(member1);
        isInitialised = true;
    }

    @Test
    public void 썸네일_수정() throws Exception {
        // given
        final var req =
                PostCreationRequest.builder()
                        .title("모집글 제목")
                        .summary("한 줄 소개")
                        .tags(new TagForm(List.of("첫줄,태그", "마지막,태그")))
                        .postTypes(List.of("학회", "학술모임"))
                        .recruitStart(new Date())
                        .recruitEnd(new Date())
                        .duration("미설정")
                        .targetCount("00명")
                        .contact("example@test.com")
                        .qualifications("전산 1전공")
                        .build();

        final var upReq =
                PostUpdateRequest.builder()
                        .title("수정된 모집글 제목")
                        .tags(new TagForm(List.of("첫줄,태그", "?")))
                        .postTypes(List.of("학회", "스터디"))
                        .duration("봄학기")
                        .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        postService.updatePost(post.getId(), upReq);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getTitle()).isEqualTo("수정된 모집글 제목");
        assertThat(res.getTags().getFirst()).isEqualTo(List.of("첫줄", "태그"));
        assertThat(res.getTags().getSecond()).isEqualTo(List.of());
        assertThat(res.getPostTypes()).isEqualTo(List.of("학회", "스터디"));
        assertThat(res.getSummary()).isEqualTo("한 줄 소개");
        assertThat(res.getDuration()).isEqualTo("봄학기");
    }

    @Test
    public void 모집마감일_수정_자동재오픈() throws Exception {
        // given
        final var req =
                PostCreationRequest.builder()
                        .title("모집글 제목")
                        .summary("한 줄 소개")
                        .tags(new TagForm(List.of("첫줄,태그", "마지막,태그")))
                        .postTypes(List.of("학회", "학술모임"))
                        .recruitStart(new Date())
                        .recruitEnd(new Date())
                        .duration("미설정")
                        .targetCount("00명")
                        .contact("example@test.com")
                        .qualifications("전산 1전공")
                        .build();

        var post = postService.createPost(req, TEST_EMAIL);

        final var upReq1 = PostUpdateRequest.builder().isClosed(true).build();
        postService.updatePost(post.getId(), upReq1);
        var res1 = postService.readOnePost(post.getId(), TEST_EMAIL);

        assertThat(res1.isClosed()).isEqualTo(true);

        final var upReq2 = PostUpdateRequest.builder().recruitEnd(new Date(2023, 11, 11)).build();

        // when
        postService.updatePost(post.getId(), upReq2);
        var res2 = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res2.isClosed()).isEqualTo(false);
    }

    @Test
    public void 모집마감일_설정에서_미설정으로() throws Exception {
        // given
        var req =
                PostCreationRequest.builder()
                        .title("제목")
                        .recruitStart(new Date())
                        .recruitEnd(new Date())
                        .build();
        var post = postService.createPost(req, TEST_EMAIL);

        // when
        var form = PostUpdateRequest.builder().recruitEnd(null).build();
        var pid = postService.updatePost(post.getId(), form).getId();
        var res = postService.readOnePost(pid, TEST_EMAIL);

        // then
        assertThat(res.getTitle()).isEqualTo("제목");
        assertThat(res.getRecruitEnd()).isNull();
    }

    @Test
    public void 모집마감일_미설정에서_설정으로() throws Exception {
        // given
        var req =
                PostCreationRequest.builder().title("제목").recruitStart(new Date()).recruitEnd(null).build();
        var post = postService.createPost(req, TEST_EMAIL);

        // when
        var form = PostUpdateRequest.builder().recruitEnd(new Date()).build();
        var pid = postService.updatePost(post.getId(), form).getId();
        var res = postService.readOnePost(pid, TEST_EMAIL);

        // then
        assertThat(res.getTitle()).isEqualTo("제목");
        assertThat(res.getRecruitEnd()).isNotNull();
    }

    @Test
    public void 마감일지난_모집글_마감처리() throws Exception {
        // given
        Calendar instance = Calendar.getInstance();
        instance.setTime(new Date());
        Date start = instance.getTime();
        instance.add(Calendar.DAY_OF_MONTH, -1);

        var req =
                PostCreationRequest.builder()
                        .title("제목")
                        .recruitStart(start)
                        .recruitEnd(instance.getTime())
                        .build();
        var post = postService.createPost(req, TEST_EMAIL);

        // when
        scheduledTasks.midnightPostClose();
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.isClosed()).isTrue();
    }
}
