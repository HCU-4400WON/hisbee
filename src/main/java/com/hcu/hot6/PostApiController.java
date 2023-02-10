package com.hcu.hot6;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostApiController {

    private final PostService postService;

    /**
     * 모집글 게시(CREATE)
     * */
    @PostMapping("/posts")
    public ResponseEntity createPost(@RequestBody @Validated PostCreationRequest request) throws Exception{
        return ResponseEntity.ok(postService.createPost(request));
    }

    /**
     * 모집글 삭제(DELETE) -> 권한 설정 미완
     * */
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Long> deletePost(@PathVariable Long postId) throws Exception{
        return ResponseEntity.ok(postService.deletePost(postId));
    }

    /**
     * 모집글 정보 상세조회(READ)
     * */
    @GetMapping("/posts/{postId}")
    public ResponseEntity readOnePost(@PathVariable Long postId) throws Exception{
        return ResponseEntity.ok(postService.readOnePost(postId));
    }

    /**
     * 모집글 정보 수정(update) : 단순 수정 + 모집 현황 수정
     * */
    @PutMapping("/posts/{postId}")
    public ResponseEntity updatePost(@PathVariable Long postId, @RequestBody PostUpdateRequest request) throws Exception{
        return ResponseEntity.ok(postService.updatePost(postId, request));
    }
}
