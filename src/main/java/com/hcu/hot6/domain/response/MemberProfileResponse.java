package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Department;
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
        this.pictureUrl = member.getPictureUrl();
        this.nickname = member.getNickname();
        this.department = member.getDepartment();

        this.posts = member.getPosts()
                .stream()
                .map(post -> post.toResponse(email))
                .collect(Collectors.toList());
    }

    private final String email;
    private final String pictureUrl;
    private final String nickname;
    private final Department department;
    private final List<PostReadOneResponse> posts;
}
