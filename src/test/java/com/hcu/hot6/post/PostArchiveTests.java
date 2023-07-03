package com.hcu.hot6.post;

import static org.assertj.core.api.Assertions.assertThat;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.PostService;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@ActiveProfiles("dev")
public class PostArchiveTests {

    private static String TEST_EMAIL = "test@example.com";
    private static boolean isInitialised;

    @Autowired private PostService postService;

    @Autowired private MemberRepository memberRepository;

    @PostConstruct
    void memberSetup() {
        if (isInitialised) return;

        Member member1 = Member.builder().uid("1").email(TEST_EMAIL).pictureUrl("picture").build();

        member1.update(MemberRequest.builder().nickname("member1").build());

        memberRepository.save(member1);
        isInitialised = true;
    }

    @Test
    public void 모집글을_보관할수있다() throws Exception {
        // given
        var req =
                PostCreationRequest.builder()
                        .title("모집글 제목")
                        .postTypes(List.of("학회"))
                        .contact(TEST_EMAIL)
                        .build();

        // when
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.addArchive(post.getId(), TEST_EMAIL);
        var res2 = postService.readOnePost(post.getId(), TEST_EMAIL);

        // then
        assertThat(res2.isArchived()).isTrue();
    }

    @Test
    public void 보관한_모집글을_모아본다() throws Exception {
        // given
        // 아카이브 한 모집글
        var req =
                PostCreationRequest.builder()
                        .title("모집글 제목")
                        .postTypes(List.of("학회"))
                        .contact(TEST_EMAIL)
                        .build();
        var post = postService.createPost(req, TEST_EMAIL);
        var res = postService.addArchive(post.getId(), TEST_EMAIL);

        // 아카이브 안 한 모집글
        var req2 =
                PostCreationRequest.builder()
                        .title("모집글 제목2")
                        .postTypes(List.of("학회2"))
                        .contact(TEST_EMAIL)
                        .build();
        var post2 = postService.createPost(req2, TEST_EMAIL);

        // when
        var archivedPosts = postService.readArchivedPost(TEST_EMAIL);

        assertThat(archivedPosts.getPosts().get(0).getTitle()).isEqualTo("모집글 제목");
        assertThat(archivedPosts.getTotal()).isEqualTo(1);
    }
}
