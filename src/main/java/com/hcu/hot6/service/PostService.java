package com.hcu.hot6.service;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.domain.response.PostFilterResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Post post = new Post(request, author);
        postRepository.save(post);

        return PostCreationResponse.builder()
                .id(post.getId())
                .title(post.getThumbnail().getTitle())
                .createdDate(post.getCreatedDate())
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
    public PostReadOneResponse updatePost(Long postId,
                                          PostUpdateRequest request,
                                          String email) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.update(request);
        return post.toResponse(email);
    }

    public PostFilterResponse readFilteredPost(PostSearchFilter filter, String email) {
        if (Objects.isNull(filter.getPage())) {
            var thumbnailResponses = postRepository.findAll(filter).stream()
                    .map(post -> post.getThumbnail().toResponse(email))
                    .toList();

            return new PostFilterResponse(
                    thumbnailResponses.size(),
                    List.of(),
                    thumbnailResponses
            );
        }
        var pagination = new Pagination(filter.getPage(), postRepository.count(filter));
        var postResponseList = postRepository.findAll(filter, pagination.getOffset())
                .stream()
                .map(post -> post.getThumbnail().toResponse(email))
                .toList();

        return new PostFilterResponse(
                pagination.getTotal(),
                List.of(),
                postResponseList
        );
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
