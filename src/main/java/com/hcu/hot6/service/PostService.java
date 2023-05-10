package com.hcu.hot6.service;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.*;
import com.hcu.hot6.repository.KeywordRepository;
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
    private final KeywordRepository keywordRepository;

    public Post createPost(PostCreationRequest request, String email) {
        Member author = memberRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Author is not registered"));
        Post post = new Post(request, author);
        postRepository.save(post);

        return post;
    }

    public Long deletePost(Long postId) {
        Post post = postRepository.findOne(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.getPostKeywords()
                .stream()
                .map(postKeyword -> postKeyword.getKeyword().countDown())
                .filter(keyword -> keyword.getCount() == 0L)
                .forEach(keywordRepository::delete);

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

    public PostFilterResponse readFilteredPost(PostSearchFilter filter) {
        Member member = memberRepository.findByEmail(filter.getEmail())
                .orElse(null);

        if (Objects.isNull(filter.getPage())) {
            var thumbnailResponses = postRepository.findAll(filter, member).stream()
                    .map(post -> post.getThumbnail().toResponse(filter.getEmail()))
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
                .map(post -> post.getThumbnail().toResponse(filter.getEmail()))
                .toList();

        return new PostFilterResponse(
                postResponseList.size(),
                List.of(),
                postResponseList
        );
    }

    public LikesResponse addBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        post.addBookmark(member);
        List<Likes> like = likesRepository.findOne(post, member);

        return new LikesResponse(like.get(0));
    }

    public LikesResponse delBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        List<Likes> like = likesRepository.findOne(post, member);
        post.delBookmark(like.get(0), member);

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
