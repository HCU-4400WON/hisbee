package com.hcu.hot6.controller;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    private static final String TEST_EMAIL = "test@example.com";

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private MemberRepository memberRepository;

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
        Member member1 = Member.builder()
                .uid("1")
                .email(TEST_EMAIL)
                .pictureUrl("picture")
                .build();

        memberRepository.save(member1);
    }

    @Test
    public void 인증_확인_홈페이지() throws Exception {
        // when
        MvcResult mvcResult = mockMvc
                .perform(get("/auth")
                        .with(oauth2Login()
                                .attributes(attr -> attr
                                        .put("sub", TEST_EMAIL))))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        // then
        String res = mvcResult.getResponse().getContentAsString();
        assertThat(res).isEqualTo(TEST_EMAIL);
    }

}