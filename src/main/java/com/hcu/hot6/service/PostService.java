package com.hcu.hot6.service;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import com.hcu.hot6.domain.request.PostCreationRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public PostReadOneResponse readOnePost(Long postId) {
        Post post = postRepository.findOne(postId);

        if(post == null){
            throw new EntityNotFoundException("Post is not found.");
        }

        return responseOne(post);
    }

    @Transactional
    public PostReadOneResponse updatePost(Long postId, PostUpdateRequest request) {
        Post post = postRepository.findOne(postId);

        // update
        if(post == null){
            throw new EntityNotFoundException("Post is not found.");
        }

        if(request.getDtype().compareTo("P") == 0){
            Project project = (Project) post;
            project.updateProject(request);
        }
        else if(request.getDtype().compareTo("M") == 0){
            Mentoring mentoring = (Mentoring) post;
            mentoring.updateMentoring(request);
        }
        else if(request.getDtype().compareTo("S") == 0){
            Study study = (Study) post;
            study.updateStudy(request);
        }

        return responseOne(post);
    }

    private PostReadOneResponse responseOne(Post post){
        PostReadOneResponse response = new PostReadOneResponse();

        response.setDtype(post.getDtype());
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setContact(post.getContact());
        response.setPostStart(post.getPeriod().getPostStart());
        response.setPostEnd(post.getPeriod().getPostEnd());
        response.setProjectStart(post.getPeriod().getProjectStart());
        response.setProjectEnd(post.getPeriod().getProjectEnd());
        response.setWriter(post.getAuthor().getNickname());

        if(post.getDtype().compareTo("M") == 0){
            Mentoring mentoring = (Mentoring) post;

            response.setMaxMentor(mentoring.getMaxMentor());
            response.setMaxMentee(mentoring.getMaxMentee());

            response.setCurrMentor(mentoring.getCurrMentor());
            response.setCurrMentee(mentoring.getCurrMentee());

            response.setHasPay(mentoring.isHasPay());
        }
        else if(post.getDtype().compareTo("P") == 0){
            Project project = (Project) post;

            response.setMaxDeveloper(project.getMaxDeveloper());
            response.setMaxPlanner(project.getMaxPlanner());
            response.setMaxDesigner(project.getMaxDesigner());

            response.setCurrDeveloper(project.getCurrDeveloper());
            response.setCurrPlanner(project.getCurrPlanner());
            response.setCurrDesigner(project.getCurrDesigner());

            response.setHasPay(project.isHasPay());
        }
        else if(post.getDtype().compareTo("S") == 0){
            Study study = (Study) post;

            response.setMaxMember(study.getMaxMember());
            response.setCurrMember(study.getCurrMember());
        }

        return response;
    }
}
