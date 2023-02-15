package com.hcu.hot6.controller;

import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.response.MemberResponse;
import com.hcu.hot6.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/users")
    public ResponseEntity<MemberResponse> registerMember(@AuthenticationPrincipal OAuth2User user,
                                                         @RequestBody @Valid MemberRequest form) {
        String email = user.getName();
        MemberResponse response = memberService.updateMember(email, form);

        return ResponseEntity.ok(response);
    }
}
