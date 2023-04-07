package com.hcu.hot6.post;

import com.hcu.hot6.domain.Duration;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PositionForm;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@SpringBootTest
@Transactional
public class PostReadTests {

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
    public void 지원자격을_입력받는다() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(List.of("두번째줄_태그", "마지막_태그"))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .projectStart(new Date())
                .durations(List.of(Duration.SPRING, Duration.SUMMER))
                .positions(List.of(
                        PositionForm.builder()
                                .name("전체")
                                .count(5)
                                .build())
                )
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        Assertions.assertThat(res.getQualifications()).isEqualTo("전산 1전공");
    }
}
