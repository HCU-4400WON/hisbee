package com.hcu.hot6.service;

import com.hcu.hot6.domain.Likes;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.*;
import com.hcu.hot6.repository.KeywordRepository;
import com.hcu.hot6.repository.LikesRepository;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final LikesRepository likesRepository;
    private final KeywordRepository keywordRepository;

    public Post createPost(PostCreationRequest request, String email) {
        Member author =
                memberRepository
                        .findByEmail(email)
                        .orElseThrow(() -> new EntityNotFoundException("Author is not registered"));
        Post post = new Post(request, author);
        postRepository.save(post);

        return post;
    }

    public Long deletePost(Long postId) {
        Post post =
                postRepository
                        .findOne(postId)
                        .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.getPostKeywords().stream()
                .map(postKeyword -> postKeyword.getKeyword().countDown())
                .filter(keyword -> keyword.getCount() == 0L)
                .forEach(keywordRepository::delete);

        return postRepository.delete(post);
    }

    public PostReadOneResponse readOnePost(Long postId, String email) {
        Post post =
                postRepository
                        .findOne(postId)
                        .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.countUp();
        return post.toResponse(email);
    }

    public PostModifiedResponse updatePost(Long postId, PostUpdateRequest request) {
        Post post =
                postRepository
                        .findOne(postId)
                        .orElseThrow(() -> new EntityNotFoundException("Post is not found."));
        post.update(request);

        return new PostModifiedResponse(post.getId(), post.getLastModifiedDate());
    }

    public List<Post> readFilteredPost(PostSearchFilter filter) {
        Member member = memberRepository.findByEmail(filter.getEmail()).orElse(null);

        if (Objects.isNull(filter.getPage())) {
            return postRepository.findAll(filter, member);
        }
        var pagination =
                new Pagination(filter.getPage(), postRepository.count(filter, member), filter.getLimit());
        return postRepository.findAll(filter, member, pagination.getOffset(), pagination.getLimit());
    }

    public LikesResponse addBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        Likes likes = new Likes(post, member);
        member.addBookmark(likes);

        return new LikesResponse(likesRepository.save(likes));
    }

    public LikesResponse delBookmark(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow();

        Likes like = likesRepository.findOne(post, member);
        member.delBookmark(like);

        return new LikesResponse(like);
    }

    public ArchiveResponse addArchive(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow().archivedBy(member);

        return new ArchiveResponse(post.getId(), post.getArchive().getCreatedDate());
    }

    public ArchiveResponse delArchive(Long postId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findOne(postId).orElseThrow().unarchivedBy(member);

        return new ArchiveResponse(post.getId());
    }

    public PostFilterResponse readArchivedPost(String email) {
        List<PostThumbnailResponse> archivedPosts =
                postRepository.findAllArchived().stream()
                        .map(
                                post ->
                                        (post.getArchive().getMember().getEmail().equals(email))
                                                ? post.getThumbnail().toResponse(email)
                                                : null)
                        .toList();
        return new PostFilterResponse(archivedPosts.size(), List.of(), archivedPosts);
    }
}
