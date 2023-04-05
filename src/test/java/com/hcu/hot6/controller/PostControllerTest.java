package com.hcu.hot6.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.response.MemberPoolResponse;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Post에 관련된 API의 정상, 비정상 작동 상황 모두 테스트
 * <p>
 * 기타
 * - Post Create 시, LocalDateTime에 실제 날짜의 범위를 넘어선 값이 들어오는 경우에 대해서는 Validation 어노테이션 필요 없음 -> 자바에서 LocalDateTime으로 변환하는 과정에서 Validation 체크
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class PostControllerTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PostService postService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @PostConstruct
    void memberSetup() {
        if (isInitialised) return;

        Member member1 = Member.builder()
                .uid("1")
                .email(TEST_EMAIL)
                .pictureUrl("picture")
                .build();

        Member member2 = Member.builder()
                .uid("2")
                .email("lifeIsGood@test.com")
                .pictureUrl("picture")
                .build();

        member1.update(MemberRequest.builder()
                .nickname("member1")
                .isPublic(false)
                .build());

        member2.update(MemberRequest.builder()
                .nickname("member2")
                .isPublic(true)
                .build());

        memberRepository.save(member1);
        memberRepository.save(member2);
        isInitialised = true;
    }

    // ==== CREATE ==== //

    /**
     * Project, Study, Mentoring 각각, 정상 create 케이스 테스트
     */
    @DisplayName("모집글 생성: 멘토링")
    @Test
    public void createMentoring() throws Exception {
        // 1L를 PK로 가지는 유저가 있는 상태에서 테스트. -> 통과
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(new Date())
                .projectStart(new Date())
                .build();

        MvcResult result = mockMvc
                .perform(post("/posts")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        MockHttpServletResponse response = result.getResponse();
        PostCreationResponse res = objectMapper.readValue(response.getContentAsString(), PostCreationResponse.class);

        assertThat(res.getTitle()).isEqualTo("title");
    }


    /**
     * Validation 체크. RequestBody가 정상적으로 들어왔는지 다음과 같은 기준으로 확인한다. (PostCreationRequest에서 사용한 Validation 어노테이션이 잘 작동하는지 확인.)
     *
     * 1. 필수로 입력해야 하는 사항에 대해 입력하지 않은 경우 BAD_REQUEST 에러가 나야 한다.
     * 2. 날짜 입력 @Future
     * 3. 모집 인원 @PositiveOrZero
     * 5. hasPay
     * */

    /**
     * Validation 체크 1번 항목
     */
    @DisplayName("모집글 유효 검사: 필수 입력 항목 미기입 여부")
    @Test
    public void notnull_validation() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                // .title("title") # missing title
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        mockMvc
                .perform(post("/posts")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    /**
     * Validation 체크 3번 항목
     * <p>
     * Project, Study, Mentoring 각각, 모집 인원 음수인 경우 BAD_REQUEST 에러 나는지 테스트
     * 각 필드에 필요한 max 모집 인원 하나라도 음수를 입력하면 BAD_REQUEST 에러가 난다.
     * 하지만 실수로 필요한 max 모집 인원 필드를 채우지 않고 보냈을 때에는 엔티티의 @NotNull 어노테이션이 0으로 채워주기 때문에 정상 작동하는데에 문제가 없다.
     */
    @DisplayName("모집글 유효 검사: 음수 모집 인원")
    @Test
    public void 모집인원_음수() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        mockMvc
                .perform(post("/posts")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    // ==== DELETE ==== //

    @DisplayName("모집글 삭제")
    @Test
    @WithMockUser
    public void 모집글_삭제() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        postService.createPost(request, TEST_EMAIL);

        MvcResult result = mockMvc
                .perform(delete("/posts/{postId}", 1))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        assertThat(result.getResponse().getContentAsString()).isEqualTo("1");
    }


    // === READ === //

    @DisplayName("모집글 상세 보기")
    @Test
    @WithMockUser
    public void 모집글_상세_보기_소유자_아님() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        postService.createPost(request, TEST_EMAIL);

        MvcResult result = mockMvc
                .perform(get("/posts/{postId}", 1))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        PostReadOneResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                PostReadOneResponse.class);

        assertThat(response.getContent()).isEqualTo("content");
        assertThat(response.getRecruitEnd()).isEqualTo("2023-03-02T00:00");
        assertThat(response.isVerified()).isFalse();
    }

    @DisplayName("모집글 상세 보기")
    @Test
    public void 모집글_상세_보기_소유자_확인() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        postService.createPost(request, TEST_EMAIL);

        MvcResult result = mockMvc
                .perform(get("/posts/{postId}", 1)
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        PostReadOneResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                PostReadOneResponse.class);

        assertThat(response.getContent()).isEqualTo("content");
        assertThat(response.getRecruitEnd()).isEqualTo("2023-03-02T00:00");
        assertThat(response.isVerified()).isTrue();
    }

    // === UPDATE === //
    @DisplayName("모집글 수정: 멘토링")
    @Test
    @WithMockUser
    public void 모집글_수정_Mentoring() throws Exception {
        PostCreationRequest request = PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(java.sql.Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build();

        postService.createPost(request, TEST_EMAIL);
        request.setTitle("modified");

        MvcResult result = mockMvc
                .perform(put("/posts/{postId}", 1)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        PostReadOneResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                PostReadOneResponse.class);

        assertThat(response.getTitle()).isEqualTo("modified");
    }

    @Test
    public void 찜_추가() throws Exception {
        // given
        var post = postService.createPost(PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build(), TEST_EMAIL);

        // when
        MvcResult mvcResult = mockMvc
                .perform(post("/posts/{postId}/likes", post.getId())
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", "lifeIsGood@test.com"))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        // then
        PostReadOneResponse results = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(), PostReadOneResponse.class);

    }

    @Test
    public void 찜_삭제() throws Exception {
        // given
        var post = postService.createPost(PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(Timestamp.valueOf(LocalDateTime.of(2023, 3, 2, 0, 0, 0)))
                .projectStart(Timestamp.valueOf(LocalDateTime.of(2023, 3, 10, 0, 0, 0)))
                .build(), TEST_EMAIL);

        postService.addBookmark(post.getId(), "lifeIsGood@test.com");

        // when
        MvcResult mvcResult = mockMvc
                .perform(delete("/posts/{postId}/likes", post.getId())
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", "lifeIsGood@test.com"))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        // then
        PostReadOneResponse results = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(), PostReadOneResponse.class);

    }

    @Test
    public void 인재풀_조회_모집글_포함() throws Exception {
        // given
        postService.createPost(PostCreationRequest.builder()
                .title("title")
                .content("content")
                .contact("contact")
                .recruitEnd(new Date())
                .projectStart(new Date())
                .build(), "lifeIsGood@test.com");

        // when
        MvcResult mvcResult = mockMvc
                .perform(get("/pool")
                        .param("page", "1")
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", "lifeIsGood@test.com"))))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        // then
        var res = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(), MemberPoolResponse.class);
        assertThat(res.getMembers().get(0).getPosts()).isNotEmpty();
    }
}