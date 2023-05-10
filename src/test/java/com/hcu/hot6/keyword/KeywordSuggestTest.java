package com.hcu.hot6.keyword;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.KeywordService;
import com.hcu.hot6.service.PostService;
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
public class KeywordSuggestTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised = false;

    @Autowired
    private PostService postService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private KeywordService keywordService;

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
    public void 키워드를_포함하는_모집글에서_제안() throws Exception {
        // given
        var req = PostCreationRequest.builder()
                .title("최강야구 직관하실분")
                .content("티켓팅부터 같이해요")
                .recruitStart(new Date())
                .postTypes(List.of("동아리"))
                .keywords(List.of("최강", "몬스터즈", "직관", "야구", "최강몬스터즈"))
                .build();
        var req2 = PostCreationRequest.builder()
                .title("⚾한방스윙스 23-1 신입 리크루팅 안내(선수/매니저)⚾")
                .recruitStart(new Date())
                .postTypes(List.of("동아리"))
                .keywords(List.of("야구", "최강몬스터즈", "리쿠르팅", "선수", "매니저", "한방스윙스"))
                .build();
        var post1 = postService.createPost(req, TEST_EMAIL);
        var post2 = postService.createPost(req2, TEST_EMAIL);

        keywordService.addKeywords(post1, req);
        keywordService.addKeywords(post2, req2);

        // when
        List<String> res = keywordService.suggestKeyword(List.of("야구"));

        res.forEach(str -> System.out.println("str = " + str));

        // then
        assertThat(res).isNotEmpty();
        assertThat(res.get(0)).isEqualTo("최강몬스터즈");
        assertThat(res.contains("야구")).isFalse();
        assertThat(res.size()).isEqualTo(8);
    }

    @Test
    public void 두개_이상인_경우_합집합으로_확인() throws Exception {
        // given
        var req = PostCreationRequest.builder()
                .title("최강야구 직관하실분")
                .content("티켓팅부터 같이해요")
                .recruitStart(new Date())
                .postTypes(List.of("동아리"))
                .keywords(List.of("최강", "몬스터즈", "직관", "야구", "최강몬스터즈"))
                .build();
        var req2 = PostCreationRequest.builder()
                .title("23-1 한검 리쿠르팅")
                .recruitStart(new Date())
                .postTypes(List.of("동아리"))
                .keywords(List.of("검도", "대한검도", "리쿠르팅", "체육분과", "20기", "새내기환영"))
                .build();
        var post1 = postService.createPost(req, TEST_EMAIL);
        var post2 = postService.createPost(req2, TEST_EMAIL);

        keywordService.addKeywords(post1, req);
        keywordService.addKeywords(post2, req2);

        // when
        List<String> res = keywordService.suggestKeyword(List.of("야구", "검도"));

        // then
        assertThat(res).isNotEmpty();
        assertThat(res.contains("야구")).isFalse();
        assertThat(res.contains("검도")).isFalse();
        assertThat(res.size()).isEqualTo(9);
    }

    @Test
    public void 모집유형은_추천키워드에서_제외되어야함() throws Exception {
        // given
        var req = PostCreationRequest.builder()
                .title("최강야구 직관하실분")
                .content("티켓팅부터 같이해요")
                .recruitStart(new Date())
                .postTypes(List.of("야구"))
                .keywords(List.of("최강", "몬스터즈", "직관", "야구", "최강몬스터즈"))
                .build();
        var req2 = PostCreationRequest.builder()
                .title("23-1 한검 리쿠르팅")
                .recruitStart(new Date())
                .postTypes(List.of("동아리"))
                .keywords(List.of("검도", "대한검도", "리쿠르팅", "체육분과", "20기", "새내기환영"))
                .build();
        var post1 = postService.createPost(req, TEST_EMAIL);
        var post2 = postService.createPost(req2, TEST_EMAIL);

        keywordService.addKeywords(post1, req);
        keywordService.addKeywords(post2, req2);

        // when
        List<String> res = keywordService.suggestKeyword(List.of("검도", "최강"));

        // then
        assertThat(res).isNotEmpty();
        assertThat(res.contains("야구")).isFalse();
        assertThat(res.contains("동아리")).isFalse();
    }
}
