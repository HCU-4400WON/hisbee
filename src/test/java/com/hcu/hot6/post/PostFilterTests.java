package com.hcu.hot6.post;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.enums.Major;
import com.hcu.hot6.domain.enums.Year;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.domain.response.PostFilterResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
                .major1(Major.VCD)
                .major2(Major.CS)
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);

        // when
        final var filter = PostSearchFilter.builder()
                .type("학회")
                .email(TEST_EMAIL)
                .build();

        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(1L);
        assertThat(response.get(0).getPostTypes()).isEqualTo("학회,학술모임");
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
                .email(TEST_EMAIL)
                .build();

        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isZero();
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("축복")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(2L);
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .type("학회")
                .keywords("온유")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(1L);
        assertThat(response.get(0).getThumbnail().getTags()).isEqualTo("온유;축복");
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("축복")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(2L);
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);

        var target = postService.createPost(request2, TEST_EMAIL);
        var filter = PostSearchFilter.builder().build();

        // when
        postService.addArchive(target.getId(), TEST_EMAIL);
        var res = postService.readFilteredPost(filter);

        // then
        assertThat(res.size()).isEqualTo(1L);
        assertThat(res.get(0).getThumbnail().getTitle()).isEqualTo("모집글 제목");
    }

    @Test
    public void 타겟_학부를_포함한_필터링이_되어야한다() {
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
                .departments(List.of("콘텐츠융합디자인학부", "전산전자공학부"))
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
                .departments(List.of("콘텐츠융합디자인학부"))
                .build();
        final var request3 = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .departments(List.of("전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);
        postService.createPost(request3, TEST_EMAIL);


        // when
        var filter = PostSearchFilter.builder()
                .department(Department.ECE)
                .page(1)
                .limit(2)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(2L);
    }

    @Test
    public void 타겟_전공을_포함한_필터링이_되어야한다() {
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("경제학", "상담심리학"))
                .build();
        final var request3 = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .keywords(List.of("온유", "축복"))
                .contact("example@test.com")
                .departments(List.of("UIL"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);
        postService.createPost(request3, TEST_EMAIL);


        // when
        var filter = PostSearchFilter.builder()
                .department(Department.CSW)
                .page(1)
                .limit(4)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(1L);
    }

    @Test
    public void 타겟_학년을_포함한_필터링이_되어야한다() {
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
                .departments(List.of("국제어문학부"))
                .years(List.of("1학년", "4학년"))
                .build();

        var response1 = postService.createPost(request, TEST_EMAIL);
        var createdPost = postService.readOnePost(response1.getId(), TEST_EMAIL);
        createdPost.getYears();

        // when
        var filter = PostSearchFilter.builder()
                .year(Year.SOPHOMORE)
                .page(1)
                .limit(3)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(0L);
    }

    @Test
    public void 내_전공을_포함한_필터링이_되어야한다() {
        // 1전공 시각디자인, 2전공 컴퓨터공학 으로 세팅한 상태에서 테스트 진행함
        // given
        final var request = PostCreationRequest.builder()
                .title("필터링 되어 나와야 함")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("GE"))
                .build();
        final var request2 = PostCreationRequest.builder()
                .title("필터링 되어 나와야 함")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("기계공학"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .myDeptOnly(true)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isZero();
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("최강")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(1L);
        assertThat(response.get(0).getThumbnail().getTitle()).isEqualTo("최강");
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        postService.createPost(request, TEST_EMAIL);
        postService.createPost(request2, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .keywords("직관")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(2L);
    }

    @Test
    public void 페이지_limit만큼만_읽어온다() throws Exception {
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
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .build();

        for (int i = 0; i < 13; i++)
            postService.createPost(request, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .page(2)
                .limit(8)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(5L);
    }

    @Test
    public void 기타_모집글_필터링() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        postService.createPost(request, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .page(1)
                .limit(3)
                .type("기타")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(1L);
    }

    @Test
    public void 기타_false수정_모집글_필터링() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);
        var updateReq = PostUpdateRequest.builder().isETC(false).build();
        postService.updatePost(res.getId(), updateReq);

        // when
        var filter = PostSearchFilter.builder()
                .page(1)
                .limit(3)
                .type("기타")
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);

        // then
        assertThat(response.size()).isEqualTo(0L);
    }

    @Test
    public void 모든_모집글_불러오기() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);

        // when
        MvcResult mvcResult = mvc
                .perform(get("/posts"))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        var response = objectMapper.readValue(
                mvcResult.getResponse().getContentAsString(),
                PostFilterResponse.class);

        // then
        assertThat(response.getTotal()).isNotZero();
    }

    @Test
    public void 좋아요_hasLike_true_test() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);
        postService.addBookmark(res.getId(), TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .page(1)
                .limit(3)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter)
                .stream()
                .map(post -> post.getThumbnail().toResponse(TEST_EMAIL))
                .toList();

        // then
        assertThat(response.get(0).isHasLiked()).isTrue();
    }

    @Test
    public void 좋아요_hasLike_false_test() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);

        // when
        var filter = PostSearchFilter.builder()
                .page(1)
                .limit(3)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter)
                .stream()
                .map(post -> post.getThumbnail().toResponse(TEST_EMAIL))
                .toList();

        // then
        assertThat(response.get(0).isHasLiked()).isFalse();
    }

    @Test
    public void 좋아요_readOne_hasLike_true_test() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);
        postService.addBookmark(res.getId(), TEST_EMAIL);

        // when
        PostReadOneResponse postReadOneResponse = postService.readOnePost(res.getId(), TEST_EMAIL);


        // then
        assertThat(postReadOneResponse.isHasLiked()).isTrue();
    }

    @Test
    public void 좋아요_readOne_hasLike_false_test() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);
        postService.addBookmark(res.getId(), TEST_EMAIL);
        postService.delBookmark(res.getId(), TEST_EMAIL);

        // when
        PostReadOneResponse postReadOneResponse = postService.readOnePost(res.getId(), TEST_EMAIL);


        // then
        assertThat(postReadOneResponse.isHasLiked()).isFalse();
    }

    @Test
    public void 마감된모집글제외() throws Exception {
        // given
        final var request = PostCreationRequest.builder()
                .title("최강")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        final var request2 = PostCreationRequest.builder()
                .title("최강2")
                .summary("몬스터즈 경기 직관하실 분 구합니다")
                .tags(new TagForm(List.of("소망", "축복")))
                .postTypes(List.of("학회", "선교모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("전체00명")
                .contact("example@test.com")
                .departments(List.of("시각디자인", "GE", "전산전자공학부"))
                .isETC(true)
                .build();

        var res = postService.createPost(request, TEST_EMAIL);
        var res2 = postService.createPost(request2, TEST_EMAIL);

        PostUpdateRequest updateRequest = PostUpdateRequest.builder().isClosed(true).build();
        postService.updatePost(res2.getId(), updateRequest);


        // when
        var filter = PostSearchFilter.builder()
                .page(1)
                .limit(3)
                .openOnly(true)
                .email(TEST_EMAIL)
                .build();
        var response = postService.readFilteredPost(filter);


        // then
        assertThat(response.size()).isEqualTo(1);
    }
}
