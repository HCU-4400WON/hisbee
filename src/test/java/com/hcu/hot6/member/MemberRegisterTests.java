package com.hcu.hot6.member;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.repository.MemberRepository;
import jakarta.persistence.NoResultException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class MemberRegisterTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    MemberRepository repository;

    @Autowired
    ObjectMapper mapper;

    @Test
    public void 닉네임이_존재하지_않는_경우() throws Exception {
        // given
        Member member = Member.builder()
                .uid("1")
                .email("test@example.com")
                .pictureUrl("")
                .nickname("monsters")
                .build();
        String target = "최강";

        // when
        repository.save(member);

        MvcResult mvcResult = mvc
                .perform(get("/users/validation")
                        .param("nickname", target))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        Boolean isPresent = (Boolean) mapper.readValue(
                mvcResult.getResponse().getContentAsString(),
                Map.class
        ).get("isPresent");

        // then
        assertThrows(
                NoResultException.class,
                () -> repository.findByNickname(target)
        );
        assertThat(isPresent).isFalse();
    }

    @Test
    public void 닉네임이_이미_존재하는_경우() throws Exception {
        // given
        Member member = Member.builder()
                .uid("1")
                .email("test@example.com")
                .pictureUrl("")
                .nickname("monsters")
                .build();
        String target = "monsters";

        // when
        repository.save(member);

        MvcResult mvcResult = mvc
                .perform(get("/users/validation")
                        .param("nickname", target))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        Boolean isPresent = (Boolean) mapper.readValue(
                mvcResult.getResponse().getContentAsString(),
                Map.class
        ).get("isPresent");

        // then
        assertDoesNotThrow(
                () -> repository.findByNickname("monsters")
        );
        assertThat(isPresent).isTrue();
    }
}
