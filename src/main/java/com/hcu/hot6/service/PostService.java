package com.hcu.hot6.service;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public PostCreationResponse createPost(PostCreationRequest request, String email) {
        Member author = memberRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Author is not registered"));

        Post post = Post.determinePostType(request, author)
                .orElseThrow(IllegalArgumentException::new);
        postRepository.save(post);

        return PostCreationResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .dtype(request.getDtype())
                .build();
    }

    @Transactional
    public Long deletePost(Long postId) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        return postRepository.delete(post);
    }

    public PostReadOneResponse readOnePost(Long postId, String email) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        return post.toResponse(email);
    }

    @Transactional
    public PostReadOneResponse updatePost(Long postId, PostUpdateRequest request) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));

        switch (request.getDtype()) {
            case "P" -> ((Project) post).updateProject(request);
            case "S" -> ((Study) post).updateStudy(request);
            case "M" -> ((Mentoring) post).updateMentoring(request);
        }
        return responseOne(post);
    }

    private PostReadOneResponse responseOne(Post post) {
        PostReadOneResponse response = new PostReadOneResponse();

        response.setDtype(post.getDtype());
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setContact(post.getContact());
        response.setPostStart(Date.from(post.getPeriod().getPostStart().atZone(ZoneId.systemDefault()).toInstant()));
        response.setPostEnd(Date.from(post.getPeriod().getPostEnd().atZone(ZoneId.systemDefault()).toInstant()));
        response.setProjectStart(Date.from(post.getPeriod().getProjectStart().atZone(ZoneId.systemDefault()).toInstant()));
        response.setProjectEnd(Date.from(post.getPeriod().getProjectEnd().atZone(ZoneId.systemDefault()).toInstant()));
        response.setWriter(post.getAuthor().getNickname());

        if (post.getDtype().compareTo("M") == 0) {
            Mentoring mentoring = (Mentoring) post;

            response.setMaxMentor(mentoring.getMaxMentor());
            response.setMaxMentee(mentoring.getMaxMentee());

            response.setCurrMentor(mentoring.getCurrMentor());
            response.setCurrMentee(mentoring.getCurrMentee());

            response.setHasPay(mentoring.isHasPay());
        } else if (post.getDtype().compareTo("P") == 0) {
            Project project = (Project) post;

            response.setMaxDeveloper(project.getMaxDeveloper());
            response.setMaxPlanner(project.getMaxPlanner());
            response.setMaxDesigner(project.getMaxDesigner());

            response.setCurrDeveloper(project.getCurrDeveloper());
            response.setCurrPlanner(project.getCurrPlanner());
            response.setCurrDesigner(project.getCurrDesigner());

            response.setHasPay(project.isHasPay());
        } else if (post.getDtype().compareTo("S") == 0) {
            Study study = (Study) post;

            response.setMaxMember(study.getMaxMember());
            response.setCurrMember(study.getCurrMember());
        }
        return response;
    }

    public List<Post> readFilteredPost(PostSearchFilter filter) {
        if (Objects.isNull(filter.getPage())) {
            return postRepository.findAll(filter);
        }
        Long count = postRepository.count(filter);
        var pagination = new Pagination(filter.getPage(), count);

        return postRepository.findAll(filter, pagination.getOffset());
    }

    @Transactional
    public PostReadOneResponse addBookmark(Long postId, String name) {
        Member member = memberRepository.findByEmail(name).orElseThrow();
        Post post = postRepository.findOne(postId)
                .orElseThrow()
                .addBookmark(member);

        return post.toResponse(name);
    }

    @Transactional
    public PostReadOneResponse delBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId)
                .orElseThrow()
                .delBookmark(member);

        return post.toResponse(email);
    }
}
