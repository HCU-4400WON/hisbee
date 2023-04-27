package com.hcu.hot6.post;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Duration;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.domain.response.PostFilterResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@Transactional
public class PostFilterTests {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private MockMvc mvc;

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
    public void 모집유형에_해당하는_모집글을_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("두번째줄_태그", "마지막_태그")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체 00명")
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);

        // when
        final var filter = PostSearchFilter.builder()
                .type("학회")
                .build();

        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(1L);
        assertThat(response.getPosts().get(0).getPostTypes()).isEqualTo(List.of("학회", "학술모임"));
    }

    @Test
    public void 모집유형에_해당하지_않는_모집글은_나오지_않는다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("두번째줄_태그", "마지막_태그")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);

        // when
        final var filter = PostSearchFilter.builder()
                .type("동아리")
                .build();

        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isZero();
    }

    @Test
    public void 썸네일_태그를_키워드로_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();

        final var request2 = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("온유", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("축복")
                .build();
        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(2L);
    }

    @Test
    public void 모집유형과_키워드를_모두_만족하는_모집글을_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("온유", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .type("학회")
                .keywords("온유")
                .build();
        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(1L);
        assertThat(response.getPosts().get(0).getTags().getFirst()).isEqualTo(List.of("온유"));
        assertThat(response.getPosts().get(0).getTags().getSecond()).isEqualTo(List.of("축복"));
    }

    @Test
    public void 썸네일_태그와_모집글_키워드를_포함하여_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("축복")
                .build();
        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(2L);
    }

    @Test
    public void 아카이브된_모집글은_보이지_않아야한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("보관될 모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);

        var target = postService.createPost(request2, TEST_EMAIL);
        var filter = PostSearchFilter.builder().build();

        // when
        postService.addArchive(target.getId(), TEST_EMAIL);
        PostFilterResponse res = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(res.getTotal()).isEqualTo(1L);
        assertThat(res.getPosts().size()).isEqualTo(1);
        assertThat(res.getPosts().get(0).getTitle()).isEqualTo("모집글 제목");
    }

    @Test
    public void 썸네일_제목도_포함하여_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("몬스터즈")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("최강")
                .build();
        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(1L);
        assertThat(response.getPosts().get(0).getTitle()).isEqualTo("최강");
    }

    @Test
    public void 썸네일_한줄소개_포함하여_필터링한다() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("몬스터즈")
                .summary("경기 직관하실 분 구합니다")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("직관")
                .build();
        var response = postService.readFilteredPost(filter, TEST_EMAIL);

        // then
        assertThat(response.getTotal()).isEqualTo(2L);
    }
}
