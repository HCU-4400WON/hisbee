package com.hcu.hot6.post;

import com.hcu.hot6.domain.Duration;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("dev")
public class PostUpdateTests {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired
    private PostService postService;

    @Autowired
    private MemberRepository memberRepository;

    @PostConstruct
    void memberSetup() {
        if (isInitialised) return;

        Member member1 = Member.builder()
                .uid("1")
                .email(TEST_EMAIL)
                .pictureUrl("picture")
                .build();

        member1.update(MemberRequest.builder()
                .nickname("member1")
                .isPublic(false)
                .build());

        memberRepository.save(member1);
        isInitialised = true;
    }

    @Test
    public void 썸네일_수정() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
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

        final var upReq = PostUpdateRequest.builder()
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
}
