package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import com.hcu.hot6.util.Utils;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(value = AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member author;
    private String postTypes;   // keyword. "," 콤마로 구분
    private String contact;

    // 필수 아닌 필드
    private String content;
    private String contactDetails;
    private String qualifications;
    private String targetYears;         // 다중선택 가능. "," 콤마로 구분
    private String targetDepartment;    // 다중선택 가능. "," 콤마로 구분

    @OneToMany(mappedBy = "post")
    private List<Likes> likes = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    private List<Position> positions = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    private List<Poster> posters = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "thumbnail_id")
    private Thumbnail thumbnail;

    private String keywords;            // 추가 설명 키워드. "," 콤마로 구분
    private Long views;                 // 조회수
    private boolean isAutoClose;

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    public Post(PostCreationRequest request, Member author) {
        // required
        this.postTypes = Utils.toString(request.getPostTypes(), ",");
        this.contact = request.getContact();

        // optional
        this.content = request.getContent();
        this.keywords = Utils.toString(request.getKeywords(), ",");
        this.contactDetails = request.getContactDetails();
        this.qualifications = request.getQualifications();
        this.targetYears = Utils.toString(request.getYears(), ",");
        this.targetDepartment = Utils.toString(request.getDepartments(), ",");
        this.views = 0L;
        this.isAutoClose = false;
        registerAuthor(author);
        createThumbnail(new Thumbnail(request));
    }

    //=== 연관관계 메서드 ===//

    private void createThumbnail(Thumbnail thumbnail) {
        this.thumbnail = thumbnail;
        thumbnail.setPost(this);
    }

    private void registerAuthor(Member author) {
        this.author = author;
        author.getPosts().add(this);
    }

    public Post addBookmark(Member member) {
        return null;
    }

    public Post delBookmark(Member member) {
        return null;
    }

    public void update(PostUpdateRequest request) {
        this.content = request.getContent();
        this.contact = request.getContact();
    }

    public PostReadOneResponse toResponse(String email) {
        return new PostReadOneResponse(this, email);
    }
}
