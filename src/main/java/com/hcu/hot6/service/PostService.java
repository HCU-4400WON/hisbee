package com.hcu.hot6.service;

import com.hcu.hot6.domain.Likes;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.*;
import com.hcu.hot6.repository.LikesRepository;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final LikesRepository likesRepository;

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

    public Long deletePost(Long postId) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        return postRepository.delete(post);
    }

    public PostReadOneResponse readOnePost(Long postId, String email) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.countUp();
        return post.toResponse(email);
    }

    public PostModifiedResponse updatePost(Long postId,
                                           PostUpdateRequest request) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.update(request);

        return new PostModifiedResponse(post.getId(), post.getLastModifiedDate());
    }

    public PostFilterResponse readFilteredPost(PostSearchFilter filter, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();

        if (Objects.isNull(filter.getPage())) {
            var thumbnailResponses = postRepository.findAll(filter, member).stream()
                    .map(post -> post.getThumbnail().toResponse(email))
                    .toList();

            return new PostFilterResponse(
                    thumbnailResponses.size(),
                    List.of(),
                    thumbnailResponses
            );
        }
        var pagination = new Pagination(filter.getPage(), postRepository.count(filter, member), filter.getLimit());
        var postResponseList = postRepository.findAll(filter, member, pagination.getOffset(), pagination.getLimit())
                .stream()
                .map(post -> post.getThumbnail().toResponse(email))
                .toList();

        return new PostFilterResponse(
                postResponseList.size(),
                List.of(),
                postResponseList
        );
    }

    public LikesResponse addBookmark(Long postId, String name) {
        Member member = memberRepository.findByEmail(name).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        Likes like = new Likes(post, member);
        likesRepository.save(like);

        return new LikesResponse(like);
    }

    public LikesResponse delBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        List<Likes> like = likesRepository.findOne(post, member);
        likesRepository.delete(like.get(0));

        return new LikesResponse(like.get(0));
    }

    public ArchiveResponse addArchive(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId)
                .orElseThrow()
                .archivedBy(member);

        return new ArchiveResponse(post.getId(), post.getArchive().getCreatedDate());
    }

    public ArchiveResponse delArchive(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId)
                .orElseThrow()
                .unarchivedBy(member);

        return new ArchiveResponse(post.getId());
    }

    public PostFilterResponse readArchivedPost(String email) {
        List<PostThumbnailResponse> archivedPosts = postRepository.findAllArchived().stream()
                .map(post -> (post.getArchive().getMember().getEmail().equals(email)) ? post.getThumbnail().toResponse(email) : null)
                .toList();
        return new PostFilterResponse(archivedPosts.size(), List.of(), archivedPosts);
    }
}
