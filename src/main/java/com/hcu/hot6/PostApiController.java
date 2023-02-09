package com.hcu.hot6;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.response.PostCreationResponse;
import com.hcu.hot6.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostApiController {

    private final PostService postService;

//    @PostMapping("/posts")
//    public PostCreationResponse createPost(@RequestBody PostCreationRequest request){
//        return postService.createPost(request);
//    }

    @PostMapping("/posts")
    public ResponseEntity createPost(@RequestBody PostCreationRequest request){
        return ResponseEntity.ok(postService.createPost(request));
    }
}
