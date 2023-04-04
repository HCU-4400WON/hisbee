package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Position;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.Poster;
import com.hcu.hot6.domain.Thumbnail;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.hcu.hot6.util.Utils.toDate;

@Getter
@NoArgsConstructor
public class PostReadOneResponse {
    private Long id;

    // Thumbnail
    private String title;
    private String summary;
    private Date recruitStart;
    private Date recruitEnd;
    private Date projectStart;
    private List<String> durations;
    private List<String> thumbKeywords;
    private boolean isClosed;
    private boolean isArchived;

    // Post
    private String writer;
    private List<String> postTypes;
    private String contact;

    // Post optional
    private String content;
    private String contactDetails;
    private List<String> targetYears;
    private List<String> targetDepartment;
    private List<String> keywords;
    private List<String> positions;
    private List<Integer> counts;
    private List<String> postURL;


    private int nBookmarks;
    private Long views;
    private Date createdDate;
    private Date lastModifiedDate;
    private boolean isVerified;
    private boolean hasLiked;

    public PostReadOneResponse(Post post, String email) {
        Thumbnail thumbnail = post.getThumbnail();
        List<Position> positionsList = post.getPositions();
        List<Poster> posterList = post.getPosters();

        this.id = post.getId();
        this.title = thumbnail.getTitle();
        this.summary = thumbnail.getSummary();
        this.recruitStart = toDate(thumbnail.getRecruitStart());
        this.recruitEnd = toDate(thumbnail.getRecruitEnd());
        this.projectStart = toDate(thumbnail.getProjectStart());
        this.durations = Arrays.asList(thumbnail.getDurations().split(","));
        this.thumbKeywords = Arrays.asList(thumbnail.getTags().split(";")); // 프론트에서 각 라인별로 ,로 구분 후 나타내기
        this.isClosed = thumbnail.isClosed();
        this.isArchived = thumbnail.isArchived();

        this.writer = post.getAuthor().getNickname();
        this.postTypes = Arrays.asList(post.getPostTypes().split(","));
        this.contact = post.getContact();
        this.content = post.getContent();
        this.contactDetails = post.getContactDetails();
        this.targetYears = Arrays.asList(post.getTargetYears().split(","));
        this.targetDepartment = Arrays.asList(post.getTargetDepartment().split(","));
        this.keywords = Arrays.asList(post.getKeywords().split(","));

        List<String> positionNames = new ArrayList<>();
        List<Integer> positionCounts = new ArrayList<>();
        for (Position position : positionsList) {
            positionNames.add(position.getName());
            positionCounts.add(position.getCount());
        }
        this.positions = positionNames;
        this.counts = positionCounts;

        List<String> urlList = new ArrayList<>();
        for (Poster poster : posterList) {
            urlList.add(poster.getPostURL());
        }
        this.postURL = urlList;

        this.nBookmarks = post.getBookmarks().size();
        this.views = post.getViews();
        this.createdDate = toDate(post.getCreatedDate());
        this.lastModifiedDate = toDate(post.getLastModifiedDate());
        this.isVerified = email.equals(post.getAuthor().getEmail());
        this.hasLiked = post.getBookmarks().stream()
                .anyMatch(bookmark -> email.equals(bookmark.getMember().getEmail()));
    }
}
