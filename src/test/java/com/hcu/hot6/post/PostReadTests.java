package com.hcu.hot6.post;

import com.hcu.hot6.domain.Duration;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import com.hcu.hot6.util.Utils;
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
                .tags(new TagForm(List.of("두번째줄_태그", "마지막_태그")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("00명")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getQualifications()).isEqualTo("전산 1전공");
    }

    @Test
    public void 썸네일_태그는_객체형식으로_입력받는다() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("두번째줄_태그", "마지막_태그")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("00명")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);
        TagForm tags = res.getTags();

        // then
        assertThat(Utils.toString(tags.getFirst(), ",")).isEqualTo("두번째줄_태그");
        assertThat(Utils.toString(tags.getSecond(), ",")).isEqualTo("마지막_태그");
    }

    @Test
    public void 썸네일_태그_첫줄은_입력_두번째줄_없는경우() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("첫줄,태그", "?")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("00명")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);
        TagForm tags = res.getTags();

        // then
        assertThat(tags.getSecond()).isEmpty();
        assertThat(tags.getFirst()).isEqualTo(List.of("첫줄", "태그"));
    }

    @Test
    public void 썸네일_태그_첫줄은_없고_두번째줄_있는경우() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("?", "두번째줄,태그")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("00명")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);
        TagForm tags = res.getTags();

        // then
        assertThat(tags.getFirst()).isEmpty();
        assertThat(tags.getSecond()).isEqualTo(List.of("두번째줄", "태그"));
    }

    @Test
    public void 썸네일_태그_모두_없는경우() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);
        TagForm tags = res.getTags();

        // then
        assertThat(tags.getFirst()).isEmpty();
        assertThat(tags.getSecond()).isEmpty();
    }

    @Test
    public void 모집인원_기본값은_00명() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getTargetCount()).isEqualTo("00명");
    }

    @Test
    public void 모집글_프로젝트_기간_기본값_확인() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getDuration()).isEqualTo("미설정");
    }

    @Test
    public void 모집글_프로젝트_기간은_단일선택이다() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .duration("가을학기")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getDuration()).isEqualTo("가을학기");
    }

    @Test
    public void 모집글_조회시_조회수가_증가해야한다() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getViews()).isEqualTo(1);
    }

    @Test
    public void 모집글_프로젝트_기간은_직접입력_할_수_있다() throws Exception {
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .duration("봄학기 ~ 여름방학")
                .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res.getDuration()).isEqualTo("봄학기 ~ 여름방학");
    }
}
