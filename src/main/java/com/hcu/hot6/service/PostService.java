package com.hcu.hot6.service;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import com.hcu.hot6.domain.request.PostCreationRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public PostCreationResponse createPost(PostCreationRequest request) {
        Member author = memberRepository.findById(request.getAuthorId());

        if(author == null){
            throw new EntityNotFoundException("Author is not registred");
        }

        final Period period = Period.ByPeriodBuilder()
                .postEnd(request.getPostEnd())
                .projectStart(request.getProjectStart())
                .projectEnd(request.getProjectEnd())
                .build();

        Post post = null;
        PostCreationResponse postCreationResponse = new PostCreationResponse();
        if(request.getDtype().compareTo("P") == 0){
            post = Project.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .contact(request.getContact())
                    .period(period)
                    .author(author)
                    .maxDeveloper(request.getMaxDeveloper())
                    .maxPlanner(request.getMaxPlanner())
                    .maxDesigner(request.getMaxDesigner())
                    .hasPay(request.isHasPay())
                    .total(request.getMaxDeveloper() + request.getMaxPlanner() + request.getMaxDesigner())
                    .build();

            postCreationResponse.setDtype("P");
        }
        else if(request.getDtype().compareTo("S") == 0){
            post = Study.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .contact(request.getContact())
                    .period(period)
                    .author(author)
                    .maxMember(request.getMaxMember())
                    .total(request.getMaxMember())
                    .build();

            postCreationResponse.setDtype("S");
        }
        else if(request.getDtype().compareTo("M") == 0){
            post = Mentoring.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .contact(request.getContact())
                    .period(period)
                    .author(author)
                    .maxMentor(request.getMaxMentor())
                    .maxMentee(request.getMaxMentee())
                    .hasPay(request.isHasPay())
                    .total(request.getMaxMentor() + request.getMaxMentee())
                    .build();

            postCreationResponse.setDtype("M");
        }

        postRepository.save(post);

        postCreationResponse.setId(post.getId());
        postCreationResponse.setTitle(post.getTitle());
        return postCreationResponse;
    }

    @Transactional
    public Long deletePost(Long postId) {
        Post post = postRepository.findOne(postId);
        return postRepository.delete(post);
    }
}
