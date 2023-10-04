package com.hcu.hot6.domain.response;

import static com.hcu.hot6.util.Utils.toArray;
import static com.hcu.hot6.util.Utils.toDate;

import com.hcu.hot6.domain.Thumbnail;
import com.hcu.hot6.domain.request.TagForm;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostThumbnailResponse {
    private Long id;
    private String title;
    private String summary;
    private Date recruitStart;
    private Date recruitEnd;
    private List<String> postTypes;
    private TagForm tags;
    private Long views;
    private boolean hasLiked;
    private Date createdDate;
    private int nLike;
    private boolean isClosed;

    public PostThumbnailResponse(Thumbnail thumbnail, String email) {
        this.id = thumbnail.getPost().getId();
        this.title = thumbnail.getTitle();
        this.summary = thumbnail.getSummary();
        this.postTypes = toArray(thumbnail.getPost().getPostTypes(), ",");
        this.tags = new TagForm(toArray(thumbnail.getTags(), ";"));

        this.views = thumbnail.getPost().getViews();
        this.createdDate = toDate(thumbnail.getPost().getCreatedDate());
        this.recruitStart = toDate(thumbnail.getRecruitStart());
        this.recruitEnd = toDate(thumbnail.getRecruitEnd());
        this.hasLiked =
                email != null
                        && thumbnail.getPost().getLikes().stream()
                                .anyMatch(bookmark -> email.equals(bookmark.getMember().getEmail()));
        this.nLike = thumbnail.getPost().getLikes().size();
        this.isClosed = thumbnail.isClosed();
    }
}
