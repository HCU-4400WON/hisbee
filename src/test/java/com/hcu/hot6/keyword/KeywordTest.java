package com.hcu.hot6.keyword;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.LikesRepository;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import com.hcu.hot6.service.KeywordService;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("dev")
public class KeywordTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired
    private PostService postService;

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PostRepository postRepository;


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
                .build());

        memberRepository.save(member1);
        isInitialised = true;
    }

    @Test
    public void 키워드_자동완성() throws Exception{
        // given
        final var req = PostCreationRequest.builder()
                .title("모집글 제목")
                .summary("한 줄 소개")
                .tags(new TagForm(List.of("apple", "banana")))
                .postTypes(List.of("학회", "학술모임"))
                .recruitStart(new Date())
                .recruitEnd(new Date())
                .targetCount("00명")
                .contact("example@test.com")
                .qualifications("전산 1전공")
                .keywords(List.of("car", "cat", "doctor", "degree", "대한민국"))
                .build();
        var post = postService.createPost(req, TEST_EMAIL);
        keywordService.addKeywords(req.getKeywords(), req.getTags());

        // when
        List<String> res = keywordService.keywordAutoCompletion("a");
        List<Keyword> keywordList  = keywordService.findAll();

        // then
        assertThat(keywordList.size()).isGreaterThan(0);
        assertThat(res.size()).isEqualTo(4);
    }

}
