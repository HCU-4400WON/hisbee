package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Position;
import com.hcu.hot6.domain.Post;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Getter
public class MemberProfileResponse {

    public MemberProfileResponse(Member member) {
        this.email = member.getEmail();
        this.pictureUrl = member.getPictureUrl();
        this.nickname = member.getNickname();
        this.isPublic = member.isPublic();
        this.department = member.getDepartment();
        this.position = member.getPosition();
        this.bio = member.getBio();
        this.grade = member.getGrade();
        this.contact = member.getContact();

        this.club = Arrays.asList(member.getClub().split(","));
        this.externalLinks = Arrays.asList(member.getExternalLinks().split(","));

        this.likes = member.getLikes()
                .stream()
                .map(Post::toResponse)
                .collect(Collectors.toList());
        this.posts = member.getPosts()
                .stream()
                .map(Post::toResponse)
                .collect(Collectors.toList());
    }

    private final String email;
    private final String pictureUrl;
    private final String nickname;
    private final Boolean isPublic;
    private final Department department;
    private final Position position;
    private final String bio;
    private final Integer grade;
    private final String contact;
    private final List<String> club;
    private final List<String> externalLinks;
    private final List<PostReadOneResponse> likes;
    private final List<PostReadOneResponse> posts;
}
