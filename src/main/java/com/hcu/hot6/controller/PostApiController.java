package com.hcu.hot6.controller;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.enums.Year;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.*;
import com.hcu.hot6.service.KeywordService;
import com.hcu.hot6.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
public class PostApiController {

    private final PostService postService;
    private final KeywordService keywordService;

    /**
     * 모집글 게시(CREATE)
     */
    @PostMapping("/posts")
    public ResponseEntity<PostCreationResponse> createPost(
            @RequestBody @Validated PostCreationRequest request,
            @AuthenticationPrincipal OAuth2User user) {

        String email = user.getName();
        Post post = postService.createPost(request, email);
        keywordService.addKeywords(post, request);

        return ResponseEntity.ok(
                PostCreationResponse.builder()
                        .id(post.getId())
                        .title(post.getThumbnail().getTitle())
                        .createdDate(post.getCreatedDate())
                        .build()
        );
    }

    /**
     * 모집글 삭제(DELETE) -> 권한 설정 미완
     */
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Long> deletePost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.deletePost(postId));
    }

    /**
     * 모집글 정보 상세조회(READ)
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostReadOneResponse> readOnePost(@PathVariable Long postId,
                                                           @AuthenticationPrincipal OAuth2User user) {
        String email = Objects.isNull(user) ? "" : user.getName();
        return ResponseEntity.ok(postService.readOnePost(postId, email));
    }

    /**
     * 모집글 정보 수정(update) : 단순 수정 + 모집 현황 수정
     */
    @PutMapping("/posts/{postId}")
    public ResponseEntity<PostModifiedResponse> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateRequest request) {
        return ResponseEntity.ok(postService.updatePost(postId, request));
    }

    /**
     * 모집글 필터링 전체 조회
     */
    @GetMapping("/posts")
    public ResponseEntity<PostFilterResponse> readFilteredPost(@RequestParam(required = false) Integer page,
                                                               @RequestParam(required = false) String type,
                                                               @RequestParam(required = false) String keywords,
                                                               @RequestParam(required = false) OrderBy order,
                                                               @RequestParam(required = false) Integer limit,
                                                               @RequestParam(required = false) Department department,
                                                               @RequestParam(required = false) Boolean myDeptOnly,
                                                               @RequestParam(required = false) Year year,
                                                               @RequestParam(required = false) Boolean closed,
                                                               @RequestParam(required = false) Boolean openOnly,
                                                               @AuthenticationPrincipal OAuth2User user) {
        String email = (user != null) ? user.getName() : null;
        PostSearchFilter filter = PostSearchFilter.builder()
                .page(page)
                .type(type)
                .keywords(keywords)
                .orderBy(order)
                .limit(limit)
                .department(department)
                .myDeptOnly(myDeptOnly)
                .year(year)
                .isClosed(closed)
                .openOnly(openOnly)
                .email(email)
                .build();

        List<String> suggestions = keywordService.suggestKeyword(filter.getKeywords());
        List<Post> posts = postService.readFilteredPost(filter);

        return ResponseEntity.ok(
                new PostFilterResponse(
                        posts.size(),
                        suggestions,
                        posts.stream()
                                .map(post -> post.getThumbnail().toResponse(email))
                                .toList())
        );
    }

    /**
     * 아카이브된 모집글 조회
     */
    @GetMapping("/posts/archived")
    public ResponseEntity<PostFilterResponse> readAchivedPosts(@AuthenticationPrincipal OAuth2User user) {
        String email = (Objects.isNull(user)) ? "" : user.getName();
        return ResponseEntity.ok(postService.readArchivedPost(email));
    }

    @PostMapping("/posts/{postId}/likes")
    public ResponseEntity<LikesResponse> doBookmark(@PathVariable Long postId,
                                                    @AuthenticationPrincipal OAuth2User user) {
        return ResponseEntity.ok(postService.addBookmark(postId, user.getName()));
    }

    @DeleteMapping("/posts/{postId}/likes")
    public ResponseEntity<LikesResponse> undoBookmark(@PathVariable Long postId,
                                                      @AuthenticationPrincipal OAuth2User user) {
        return ResponseEntity.ok(postService.delBookmark(postId, user.getName()));
    }

    @PostMapping("/posts/{postId}/archive")
    public ResponseEntity<ArchiveResponse> doArchive(@PathVariable Long postId,
                                                     @AuthenticationPrincipal OAuth2User user) {
        return ResponseEntity.ok(postService.addArchive(postId, user.getName()));
    }

    @DeleteMapping("/posts/{postId}/archive")
    public ResponseEntity<ArchiveResponse> undoArchive(@PathVariable Long postId,
                                                       @AuthenticationPrincipal OAuth2User user) {
        return ResponseEntity.ok(postService.delArchive(postId, user.getName()));
    }

    @GetMapping("/posts/keyword")
    public Map<String, List<String>> keywordAutoCompletion(@RequestParam String q) {
        return Collections.singletonMap("results", keywordService.keywordAutoCompletion(q));
    }
}
