package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Duration;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.Poster;
import com.hcu.hot6.domain.Thumbnail;
import com.hcu.hot6.domain.request.TagForm;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.logging.log4j.util.Strings;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.hcu.hot6.util.Utils.toArray;
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
    private Duration duration;
    private List<String> postTypes;
    private TagForm tags;

    // Post
    private String author;
    private String content;
    private String contact;
    private String contactDetails;
    private String qualifications;
    private String targetCount;

    private List<String> years;
    private List<String> departments;
    private List<String> keywords;
    private List<String> posterPaths;
    private int nLike;
    private Long views;
    private boolean isVerified;
    private boolean isClosed;
    private boolean isArchived;
    private boolean hasLiked;
    private Date createdDate;
    private Date lastModifiedDate;

    public PostReadOneResponse(Post post, String email) {
        final Thumbnail thumbnail = post.getThumbnail();

        this.id = post.getId();
        this.title = thumbnail.getTitle();
        this.summary = thumbnail.getSummary();
        this.recruitStart = toDate(thumbnail.getRecruitStart());
        this.recruitEnd = toDate(thumbnail.getRecruitEnd());
        this.duration = thumbnail.getDuration();
        this.tags = (Strings.isEmpty(thumbnail.getTags())) ?
                new TagForm() :
                new TagForm(toArray(thumbnail.getTags(), ";"));
        this.isClosed = thumbnail.isClosed();
        this.isArchived = thumbnail.isArchived();

        this.author = post.getAuthor().getNickname();
        this.postTypes = toArray(post.getPostTypes(), ",");
        this.contact = post.getContact();
        this.content = post.getContent();
        this.contactDetails = post.getContactDetails();
        this.qualifications = post.getQualifications();
        this.years = (post.getTargetYears() != null) ? toArray(post.getTargetYears(), ",") : null;
        this.departments = toArray(post.getTargetDepartment(), ",");
        this.keywords = toArray(post.getKeywords(), ",");
        this.targetCount = post.getTargetCount();
        this.posterPaths = post.getPosters().stream()
                .map(Poster::getPostURL)
                .toList();

        this.nLike = post.getLikes().size();
        this.views = post.getViews();
        this.createdDate = toDate(post.getCreatedDate());
        this.lastModifiedDate = toDate(post.getLastModifiedDate());
        this.isVerified = email.equals(post.getAuthor().getEmail());
        this.hasLiked = post.getLikes().stream()
                .anyMatch(bookmark -> email.equals(bookmark.getMember().getEmail()));
    }
}
