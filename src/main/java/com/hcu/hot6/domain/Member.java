package com.hcu.hot6.domain;

import static java.util.Objects.isNull;
import static java.util.Objects.requireNonNullElse;

import com.hcu.hot6.domain.enums.Major;
import com.hcu.hot6.domain.request.MemberRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @NotNull private String uid;

    @NotNull private String email;

    @NotNull private String pictureUrl;

    private String nickname;

    @Enumerated(value = EnumType.STRING)
    private Major major1 = Major.NONE;

    @Enumerated(value = EnumType.STRING)
    private Major major2 = Major.NONE;

    private boolean isRegistered;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Likes> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author", orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Archive> archives = new ArrayList<>();

    @Builder
    public Member(
            String uid, String email, String pictureUrl, Boolean isRegistered, String nickname) {
        this.uid = uid;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.isRegistered = requireNonNullElse(isRegistered, true);

        this.nickname = nickname;
    }

    public void update(MemberRequest form) {
        this.nickname = isNull(form.getNickname()) ? nickname : form.getNickname();
        this.major1 = requireNonNullElse(form.getMajor1(), major1);
        this.major2 = requireNonNullElse(form.getMajor2(), major2);
        if (!this.isRegistered) this.isRegistered = true;
    }

    public void addBookmark(Likes likes) {
        this.likes.add(likes);
        likes.getPost().getLikes().add(likes);
    }

    public void delBookmark(Likes likes) {
        this.likes.remove(likes);
        likes.getPost().getLikes().remove(likes);
    }
}
