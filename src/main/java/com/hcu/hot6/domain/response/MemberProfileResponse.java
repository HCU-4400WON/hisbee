package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Member;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Getter
public class MemberProfileResponse {

    public MemberProfileResponse(Member member) {
        this.email = member.getEmail();
        this.nickname = member.getNickname();

        this.posts = member.getPosts()
                .stream()
                .map(post -> post.toResponse(email))
                .collect(Collectors.toList());
    }

    private final String email;
    private final String nickname;
    private final List<PostReadOneResponse> posts;
}
