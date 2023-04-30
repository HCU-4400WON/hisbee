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
                .filter(post -> post.getArchive() == null)
                .map(post -> post.toResponse(email))
                .collect(Collectors.toList());

        this.likes = member.getLikes()
                .stream()
                .map(liked -> liked.getPost().toResponse(email))
                .collect(Collectors.toList());

        this.archives = member.getArchives()
                .stream()
                .map(archive -> archive.getPost().toResponse(email))
                .collect(Collectors.toList());
    }

    private final String email;
    private final String nickname;
    private final List<PostReadOneResponse> posts;
    private final List<PostReadOneResponse> likes;
    private final List<PostReadOneResponse> archives;
}
