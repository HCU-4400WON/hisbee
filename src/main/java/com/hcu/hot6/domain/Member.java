package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.MemberRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @NotNull
    private String uid;

    @NotNull
    private String email;

    @NotNull
    private String pictureUrl;

    @Enumerated(value = EnumType.STRING)
    private Department department;

    private String nickname;
    private boolean isRegistered = true;

    @OneToMany(mappedBy = "member")
    private List<Likes> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author", orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Archive> archives = new ArrayList<>();

    //=== 생성 메서드 ===//
    @Builder(builderClassName = "ByMemberBuilder", builderMethodName = "ByMemberBuilder")
    public Member(String email, String pictureUrl, Department department, boolean isPublic, String nickname, String bio, String grade, String club, String contact, String externalLinks, List<Post> likes, List<Post> posts) {
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.department = department;
        this.nickname = nickname;
        this.posts = posts;
    }

    @Builder
    public Member(String uid,
                  String email,
                  String pictureUrl,
                  boolean isRegistered,
                  String nickname,
                  Department department) {
        this.uid = uid;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.isRegistered = isRegistered;

        this.nickname = nickname;
        this.department = department;
    }

    public void update(MemberRequest form) {
        // 기본 정보
        this.nickname = Objects.isNull(form.getNickname()) ? nickname : form.getNickname();
        this.pictureUrl = Objects.isNull(form.getPictureUrl()) ? pictureUrl : form.getPictureUrl();

        // 인재풀 등록시 필수 공개 정보
        this.department = Objects.isNull(form.getDepartment()) ? department : form.getDepartment();

        // 선택 정보
        if (!this.isRegistered) this.isRegistered = true;
    }
}