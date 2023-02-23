package com.hcu.hot6;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.MemberResponse;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostApiController {

    private final PostService postService;

    /**
     * 모집글 게시(CREATE)
     */
    @PostMapping("/posts")
    public ResponseEntity<PostCreationResponse> createPost(
            @RequestBody @Validated PostCreationRequest request,
            @AuthenticationPrincipal OAuth2User user) {

        String email = user.getName();
        PostCreationResponse response = postService.createPost(request, email);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<PostReadOneResponse> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateRequest request) {
        return ResponseEntity.ok(postService.updatePost(postId, request));
    }

    /**
     * 모집글 필터링 전체 조회
     */
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> readFilteredPost(@RequestParam int page, @RequestParam(required = false) String search, @RequestParam String order, @RequestParam(required = false) String type, @RequestParam(required = false) String position, @RequestParam(required = false) boolean pay, @RequestParam int limit) {
        PostSearchFilter searchInfo = PostSearchFilter.builder()
                .page(page)
                .search(search)
                .order(order)
                .position(position)
                .type(type)
                .pay(pay)
                .limit(limit)
                .build();
        return ResponseEntity.ok(postService.readFilteredPost(searchInfo));
    }

    @PostMapping("/posts/{postId}/likes")
    public ResponseEntity<List<MemberResponse>> doBookmark(@PathVariable Long postId,
                                                           @AuthenticationPrincipal OAuth2User user) {
        List<Member> members = postService.addBookmark(postId, user.getName());
        return ResponseEntity.ok(members.stream()
                .map(MemberResponse::new)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/posts/{postId}/likes")
    public ResponseEntity<List<MemberResponse>> undoBookmark(@PathVariable Long postId,
                                                             @AuthenticationPrincipal OAuth2User user) {
        List<Member> members = postService.delBookmark(postId, user.getName());
        return ResponseEntity.ok(members.stream()
                .map(MemberResponse::new)
                .collect(Collectors.toList()));
    }
}
