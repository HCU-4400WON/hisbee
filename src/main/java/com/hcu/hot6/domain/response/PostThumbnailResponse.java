package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Thumbnail;
import com.hcu.hot6.util.Utils;
import lombok.Getter;

import java.util.Date;
import java.util.List;

@Getter
public class PostThumbnailResponse {

    private Long id;
    private List<String> postTypes;
    private String title;
    private String summary;
    private String tags;
    private Long views;
    private Date createdDate;
    private boolean hasLiked;

    public PostThumbnailResponse(final Thumbnail thumbnail, String email) {
        this.id = thumbnail.getPost().getId();
        this.postTypes = Utils.toArray(thumbnail.getPost().getPostTypes(), ",");
        this.title = thumbnail.getTitle();
        this.summary = thumbnail.getSummary();
        this.tags = thumbnail.getTags();
        this.views = thumbnail.getPost().getViews();
        this.createdDate = Utils.toDate(thumbnail.getPost().getCreatedDate());
        this.hasLiked = thumbnail.getPost().getBookmarks().stream()
                .anyMatch(bookmark -> email.equals(bookmark.getMember().getEmail()));
    }
}
