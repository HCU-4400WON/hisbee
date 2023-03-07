package com.hcu.hot6.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.response.MemberProfileResponse;
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

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
                .willReturn(Member.ByMemberBuilder()
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
                        .getContentAsString(StandardCharsets.UTF_8), MemberResponse.class);

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

    @Test
    public void 프로필_조회_기본정보() throws Exception {
        // given
        given(memberRepository.findByEmail(anyString()))
                .willReturn(Optional.ofNullable(Member.ByMemberBuilder()
                        .email(TEST_EMAIL)
                        .nickname("username")
                        .isPublic(true)
                        .bio("bio")
                        .grade("1학년")
                        .contact("contact")
                        .department(Department.CSEE)
                        .position(Position.DEVELOPER)
                        .club("club")
                        .externalLinks("link")
                        .posts(new ArrayList<>())
                        .likes(new ArrayList<>())
                        .build()));

        // when
        MvcResult mvcResult = mvc
                .perform(get("/users/me")
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        MemberProfileResponse res = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(StandardCharsets.UTF_8), MemberProfileResponse.class);

        // then
        assertThat(res.getEmail()).isEqualTo(TEST_EMAIL);
        assertThat(res.getDepartment()).isEqualTo(Department.CSEE);
        assertThat(res.getPosition()).isEqualTo(Position.DEVELOPER);
    }

    @Test
    public void 프로필_조회_모집글_포함() throws Exception {
        // given
        given(memberRepository.findByEmail(anyString()))
                .willReturn(Optional.ofNullable(Member.ByMemberBuilder()
                        .email(TEST_EMAIL)
                        .nickname("username")
                        .isPublic(true)
                        .bio("bio")
                        .grade("1학년")
                        .contact("contact")
                        .department(Department.CSEE)
                        .position(Position.DEVELOPER)
                        .club("")
                        .externalLinks("")
                        .posts(List.of(Project.builder()
                                .dtype("P")
                                .title("title")
                                .content("content")
                                .contact("contact")
                                .author(Member.builder()
                                        .uid("1")
                                        .email(TEST_EMAIL)
                                        .pictureUrl("picture")
                                        .build())
                                .period(Period.ByPeriodBuilder()
                                        .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                                        .projectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0))
                                        .projectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0))
                                        .build())
                                .maxDeveloper(3)
                                .maxDesigner(1)
                                .build()))
                        .likes(new ArrayList<>())
                        .build()));

        // when
        MvcResult mvcResult = mvc
                .perform(get("/users/me")
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        MemberProfileResponse res = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(StandardCharsets.UTF_8), MemberProfileResponse.class);

        // then
        assertThat(res.getEmail()).isEqualTo(TEST_EMAIL);
        assertThat(res.getDepartment()).isEqualTo(Department.CSEE);
        assertThat(res.getPosition()).isEqualTo(Position.DEVELOPER);

        assertThat(res.getPosts().size()).isEqualTo(1);
        assertThat(res.getPosts().get(0).getMaxDeveloper()).isEqualTo(3);

        assertThat(res.getClub()).isEmpty();
        assertThat(res.getExternalLinks()).isEmpty();
    }

    @Test
    public void 프로필_수정() throws Exception {
        // given
        MemberRequest form = MemberRequest.builder()
                .nickname("modified")
                .isPublic(false)
                .build();

        given(memberService.updateMember(anyString(), any()))
                .willReturn(Member.ByMemberBuilder()
                        .email(TEST_EMAIL)
                        .nickname("modified")
                        .isPublic(false)
                        .bio("bio")
                        .grade("1")
                        .contact("contact")
                        .department(Department.CSEE)
                        .position(Position.DEVELOPER)
                        .club("club")
                        .externalLinks("link")
                        .posts(List.of(Project.builder()
                                .dtype("P")
                                .title("title")
                                .content("content")
                                .contact("contact")
                                .author(Member.builder()
                                        .uid("1")
                                        .email(TEST_EMAIL)
                                        .pictureUrl("picture")
                                        .build())
                                .period(Period.ByPeriodBuilder()
                                        .postEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0))
                                        .projectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0))
                                        .projectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0))
                                        .build())
                                .maxDeveloper(3)
                                .maxDesigner(1)
                                .build()))
                        .likes(new ArrayList<>())
                        .build());

        // when
        MvcResult mvcResult = mvc
                .perform(put("/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form))
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL)))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        MemberProfileResponse res = objectMapper.readValue(mvcResult.getResponse()
                .getContentAsString(StandardCharsets.UTF_8), MemberProfileResponse.class);

        // then
        assertThat(res.getNickname()).isEqualTo("modified");
        assertThat(res.getIsPublic()).isEqualTo(false);
    }

    @Test
    public void 프로필_삭제() throws Exception {
        // given
        given(memberService.deleteMember(anyString()))
                .willReturn(TEST_EMAIL);

        // when
        MvcResult mvcResult = mvc
                .perform(delete("/users/me")
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL)))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();
        // then
        assertThat(mvcResult.getResponse()
                .getContentAsString(StandardCharsets.UTF_8)).isEqualTo(TEST_EMAIL);
    }
}