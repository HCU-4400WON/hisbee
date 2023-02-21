package com.hcu.hot6.controller;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Position;
import com.hcu.hot6.domain.filter.PoolSearchFilter;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.domain.response.MemberProfileResponse;
import com.hcu.hot6.domain.response.MemberResponse;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    private final MemberRepository memberRepository;

    @PostMapping("/users")
    public ResponseEntity<MemberResponse> registerMember(@AuthenticationPrincipal OAuth2User user,
                                                         @RequestBody @Valid MemberRequest form) {
        Member member = memberService.updateMember(user.getName(), form);
        return ResponseEntity.ok(new MemberResponse(member));
    }

    @GetMapping("/users/me")
    public ResponseEntity<MemberProfileResponse> getProfile(@AuthenticationPrincipal OAuth2User user) {
        Member member = memberRepository.findByEmail(user.getName())
                .orElseThrow();
        return ResponseEntity.ok(new MemberProfileResponse(member));
    }

    @PutMapping("/users/me")
    public ResponseEntity<MemberProfileResponse> modifyProfile(@AuthenticationPrincipal OAuth2User user,
                                                               @RequestBody @Valid MemberRequest form) {
        Member member = memberService.updateMember(user.getName(), form);
        return ResponseEntity.ok(new MemberProfileResponse(member));
    }

    @DeleteMapping("/users/me")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal OAuth2User user) {
        return ResponseEntity.ok(memberService.deleteMember(user.getName()));
    }

    @GetMapping("/pool")
    public ResponseEntity<List<MemberProfileResponse>> getProfiles(@AuthenticationPrincipal OAuth2User user,
                                                                   @RequestParam int page,
                                                                   @RequestParam(required = false) Department department,
                                                                   @RequestParam(required = false) Position position,
                                                                   @RequestParam(required = false) String grade) {

        Member member = memberRepository.findByEmail(user.getName())
                .orElseThrow();

        if (member.isPublic()) {
            PoolSearchFilter filter = PoolSearchFilter.builder()
                    .page(page)
                    .department(department)
                    .position(position)
                    .grade(grade)
                    .build();

            return ResponseEntity.ok(memberService.getMatchedProfilesWith(filter)
                    .stream()
                    .map(MemberProfileResponse::new)
                    .collect(Collectors.toList()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value()).build();
    }
}
