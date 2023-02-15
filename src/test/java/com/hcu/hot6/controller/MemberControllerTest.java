package com.hcu.hot6.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.response.MemberResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.MemberService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
class MemberControllerTest {

    private final static String TEST_EMAIL = "test@exmaple.com";

    @Autowired
    WebApplicationContext context;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    MemberRepository memberRepository;

    @MockBean
    MemberService memberService;

    MockMvc mvc;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @PostConstruct
    void memberSetup() {
        Member member = Member.builder()
                .uid("1")
                .email(TEST_EMAIL)
                .pictureUrl("picture")
                .build();

        memberRepository.save(member);
    }

    @Test
    public void 프로필_생성_유효한_요청시() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("username")
                .isPublic(Boolean.FALSE)
                .build();

        given(memberService.updateMember(anyString(), any()))
                .willReturn(MemberResponse.builder()
                        .nickname(form.getNickname())
                        .isPublic(form.getIsPublic())
                        .build());

        // when
        MvcResult mvcResult = mvc
                .perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL)))
                        .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();
        // then
        MemberResponse result =
                objectMapper.readValue(mvcResult.getResponse()
                        .getContentAsString(), MemberResponse.class);

        assertThat(result.getNickname()).isEqualTo("username");
        assertThat(result.getIsPublic()).isEqualTo(false);
    }

    @Test
    public void 프로필_생성_필수정보_누락_닉네임() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                // .nickname("username")
                .isPublic(false)
                .build();

        // when
        mvc
                .perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL)))
                        .with(csrf())
                ).andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void 프로필_생성_필수정보_프로필_공개여부() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("username")
                // .isPublic(false)
                .build();

        // when
        mvc
                .perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL)))
                        .with(csrf())
                ).andDo(print())
                .andExpect(status().isBadRequest());
    }
}