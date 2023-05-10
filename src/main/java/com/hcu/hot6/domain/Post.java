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

import static com.hcu.hot6.util.Utils.nonNullOrElse;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(value = AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    private String postTypes;
    private String contact;

    // 필수 아닌 필드
    private String contactDetails;
    private String qualifications;
    private String targetYears;         // 다중선택 가능. "," 콤마로 구분
    private String targetDepartment;    // 다중선택 가능. "," 콤마로 구분
    private String targetCount;
    private String keywords;

    @Column(length = 4095)
    private String content;
    private Long views;
    private boolean isAutoClose;
    private boolean isETC;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PostKeyword> postKeywords = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Likes> likes = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Poster> posters = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "thumbnail_id")
    private Thumbnail thumbnail;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "archive_id")
    private Archive archive;

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    public Post(PostCreationRequest request, Member author) {
        // required
        this.postTypes = Utils.toString(request.getPostTypes(), ",");
        this.contact = request.getContact();

        // optional
        this.content = (request.getContent() != null) ? request.getContent() : null;
        this.keywords = (request.getKeywords() != null) ? Utils.toString(request.getKeywords(), ",") : null;
        this.contactDetails = (request.getContactDetails() != null) ? request.getContactDetails() : null;
        this.qualifications = (request.getQualifications() != null) ? request.getQualifications() : null;
        this.targetYears = (request.getYears() != null) ? Utils.toString(request.getYears(), ",") : null;
        this.targetDepartment = (request.getDepartments() != null) ? Utils.toString(request.getDepartments(), ",") : null;
        this.targetCount = (request.getTargetCount() != null) ? request.getTargetCount() : null;
        this.views = 0L;
        this.isAutoClose = false;
        this.isETC = nonNullOrElse(request.isETC(), false);
        registerAuthor(author);
        createThumbnail(new Thumbnail(request));
        savePosters(request.getPosterPaths());
    }

    //=== 연관관계 메서드 ===//

    private void createThumbnail(Thumbnail thumbnail) {
        this.thumbnail = thumbnail;
        thumbnail.setPost(this);
    }

    private void savePosters(List<String> paths) {
        if (paths == null) return;
        if (!posters.isEmpty()) posters.clear();

        List<Poster> posters = paths.stream()
                .map(path -> new Poster(path, this))
                .toList();
        this.posters.addAll(posters);
    }

    private void registerAuthor(Member author) {
        this.author = author;
        author.getPosts().add(this);
    }

    public Post archivedBy(Member member) {
        this.archive = new Archive(this, member);
        member.getArchives().add(archive);

        return this;
    }

    public Post unarchivedBy(Member member) {
        member.getArchives().remove(archive);
        this.archive = null;

        return this;
    }

    public Post addBookmark(Member member) {
        Likes like = new Likes(this, member);
        member.getLikes().add(like);
        return this;
    }

    public Post delBookmark(Likes like, Member member) {
        this.getLikes().remove(like);
        member.getLikes().remove(like);

        return this;
    }

    public void update(PostUpdateRequest req) {
        this.postTypes = (req.getPostTypes() != null)
                ? Utils.toString(req.getPostTypes(), ",")
                : postTypes;
        this.contact = nonNullOrElse(req.getContact(), contact);
        this.contactDetails = nonNullOrElse(req.getContactDetails(), contactDetails);
        this.qualifications = nonNullOrElse(req.getQualifications(), qualifications);
        this.targetYears = (req.getYears() != null)
                ? Utils.toString(req.getYears(), ",")
                : targetYears;
        this.targetDepartment = (req.getDepartments() != null)
                ? Utils.toString(req.getDepartments(), ",")
                : targetDepartment;
        this.targetCount = nonNullOrElse(req.getTargetCount(), targetCount);
        this.keywords = (req.getKeywords() != null)
                ? Utils.toString(req.getKeywords(), ",")
                : keywords;
        this.content = nonNullOrElse(req.getContent(), content);
        this.isETC = nonNullOrElse(req.getIsETC(), isETC);

        thumbnail.update(req);
        savePosters(req.getPosterPaths());
    }

    public PostReadOneResponse toResponse(String email) {
        return new PostReadOneResponse(this, email);
    }

    public void countUp() {
        views++;
    }
}
