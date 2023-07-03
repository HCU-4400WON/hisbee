package com.hcu.hot6.domain.response;

import static com.hcu.hot6.util.Utils.toArray;
import static com.hcu.hot6.util.Utils.toDate;
import static java.util.Objects.requireNonNullElse;

import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.Poster;
import com.hcu.hot6.domain.Thumbnail;
import com.hcu.hot6.domain.request.TagForm;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.logging.log4j.util.Strings;

@Getter
@NoArgsConstructor
public class PostReadOneResponse {
    private Long id;

    // Thumbnail
    private String title;
    private String summary;
    private Date recruitStart;
    private Date recruitEnd;
    private String duration;
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
    private boolean isETC;

    public PostReadOneResponse(Post post, String email) {
        final Thumbnail thumbnail = post.getThumbnail();

        this.id = post.getId();
        this.title = thumbnail.getTitle();
        this.summary = requireNonNullElse(thumbnail.getSummary(), "");
        this.recruitStart = toDate(thumbnail.getRecruitStart());
        this.recruitEnd = toDate(thumbnail.getRecruitEnd());
        this.duration = thumbnail.getDuration();
        this.tags =
                (Strings.isEmpty(thumbnail.getTags()))
                        ? new TagForm()
                        : new TagForm(toArray(thumbnail.getTags(), ";"));
        this.isClosed = thumbnail.isClosed();
        this.isArchived = post.getArchive() != null;

        this.author = post.getAuthor().getNickname();
        this.postTypes = toArray(post.getPostTypes(), ",");
        this.contact = post.getContact();
        this.content = requireNonNullElse(post.getContent(), "");
        this.contactDetails = requireNonNullElse(post.getContactDetails(), "");
        this.qualifications = requireNonNullElse(post.getQualifications(), "");
        this.years = toArray(post.getTargetYears(), ",");
        this.departments = toArray(post.getTargetDepartment(), ",");
        this.keywords = toArray(post.getKeywords(), ",");
        this.targetCount = post.getTargetCount();
        this.posterPaths = post.getPosters().stream().map(Poster::getPath).toList();
        this.nLike = post.getLikes().size();
        this.views = post.getViews();
        this.createdDate = toDate(post.getCreatedDate());
        this.lastModifiedDate = toDate(post.getLastModifiedDate());
        this.isVerified = email.equals(post.getAuthor().getEmail());
        this.hasLiked =
                email != null
                        && post.getLikes().stream()
                                .anyMatch(bookmark -> email.equals(bookmark.getMember().getEmail()));
        this.isETC = post.isETC();
    }
}
