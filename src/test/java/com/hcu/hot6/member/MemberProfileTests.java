package com.hcu.hot6.member;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.enums.Major;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.response.MemberProfileResponse;
import com.hcu.hot6.domain.response.MemberResponse;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.MemberService;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("dev")
public class MemberProfileTests {

    private static final String TEST_EMAIL = "test@example.com";

    @Autowired
    PostService postService;

    @Autowired
    MemberService memberService;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    @PostConstruct
    void setup() {
        Member member = Member.builder()
                .uid("1")
                .email(TEST_EMAIL)
                .pictureUrl("")
                .build();

        memberRepository.save(member);
    }

    @Test
    public void 유저_정보가_표시_되어야_한다() throws Exception {
        // given
        MemberRequest req = MemberRequest.builder()
                .nickname("monsters")
                .major1(Major.GLS)
                .major2(Major.NONE)
                .build();
        String form = mapper.writeValueAsString(req);

        // when
        MvcResult mvcResult = mvc
                .perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(form)
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        var res = mapper.readValue(mvcResult.getResponse().getContentAsString(), MemberResponse.class);

        // then
        assertThat(res.getNickname()).isEqualTo("monsters");
        assertThat(res.getMajor1()).isEqualTo(Major.GLS);
        assertThat(res.getMajor2()).isEqualTo(Major.NONE);
    }

    @Test
    public void 내가_쓴_글을_불러올_수_있다() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("monsters")
                .major1(Major.GLS)
                .build();
        memberService.updateMember(TEST_EMAIL, form);

        var post = PostCreationRequest.builder()
                .title("lorem ipsum")
                .build();
        postService.createPost(post, TEST_EMAIL);

        // when
        Member member = memberRepository.findByEmail(TEST_EMAIL)
                .orElseThrow();
        var res = new MemberProfileResponse(member);

        // then
        assertThat(res.getProfile().getNickname()).isEqualTo("monsters");
        assertThat(res.getPosts()).isNotEmpty();
    }

    @Test
    public void 좋아요한_글을_불러올_수_있다() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("monsters")
                .major1(Major.GLS)
                .build();
        memberService.updateMember(TEST_EMAIL, form);

        var req = PostCreationRequest.builder()
                .title("lorem ipsum")
                .build();
        PostCreationResponse post = postService.createPost(req, TEST_EMAIL);
        postService.addBookmark(post.getId(), TEST_EMAIL);

        // when
        Member member = memberRepository.findByEmail(TEST_EMAIL)
                .orElseThrow();
        MemberProfileResponse res = new MemberProfileResponse(member);

        // then
        assertThat(res.getLikes()).isNotEmpty();
        assertThat(res.getArchives()).isEmpty();
    }

    @Test
    public void 아카이브한_글을_불러올_수_있다() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("monsters")
                .major1(Major.GLS)
                .build();
        memberService.updateMember(TEST_EMAIL, form);

        var req = PostCreationRequest.builder()
                .title("lorem ipsum")
                .build();
        PostCreationResponse post = postService.createPost(req, TEST_EMAIL);
        postService.addArchive(post.getId(), TEST_EMAIL);

        // when
        Member member = memberRepository.findByEmail(TEST_EMAIL)
                .orElseThrow();
        MemberProfileResponse res = new MemberProfileResponse(member);

        // then
        assertThat(res.getLikes()).isEmpty();
        assertThat(res.getArchives()).isNotEmpty();
        assertThat(res.getPosts()).isEmpty();
    }

    @Test
    public void 유저_정보는_수정될_수_있다() throws Exception {
        // given
        MemberRequest req = MemberRequest.builder()
                .nickname("monsters")
                .major1(Major.GLS)
                .major2(Major.NONE)
                .build();
        memberService.updateMember(TEST_EMAIL, req);

        // when
        MemberRequest req2 = MemberRequest.builder()
                .nickname("godisgood")
                .major1(Major.CS)
                .major2(Major.EE)
                .build();
        var form = mapper.writeValueAsString(req2);

        MvcResult mvcResult = mvc
                .perform(put("/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(form)
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        String data = mvcResult.getResponse().getContentAsString();
        MemberResponse res = mapper.readValue(data, MemberResponse.class);

        // then
        assertThat(res.getNickname()).isEqualTo("godisgood");
        assertThat(res.getMajor1()).isEqualTo(Major.CS);
        assertThat(res.getMajor2()).isEqualTo(Major.EE);
    }
}
