package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.hcu.hot6.util.Utils.toDate;

@Getter
@NoArgsConstructor
public class PostReadOneResponse {
    private Long id;
    private String writer;
    private String title;
    private String content;
    private String contact;
    private Date postStart;
    private Date postEnd;
    private Date projectStart;
    private List<String> durations;
    private List<String> keywords;
    private int nlike;
    private int total;
    private int curr;
    private int views;
    private Date createdDate;
    private Date lastModifiedDate;
    private boolean isVerified;
    private boolean hasLiked;

    public PostReadOneResponse(Post post, String email) {
        this.id = post.getId();
        this.writer = post.getAuthor().getNickname();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.contact = post.getContact();
        this.postStart = toDate(post.getPeriod().getPostStart());
        this.postEnd = toDate(post.getPeriod().getPostEnd());
        this.projectStart = toDate(post.getPeriod().getProjectStart());
        this.durations = Arrays.asList(post.getDurationList().split(","));
        this.keywords = Arrays.asList(post.getKeywordList().split(","));
        this.nlike = post.getLikes().size();
        this.total = post.getTotal();
        this.curr = post.getCurr();
        this.views = post.getViews();
        this.createdDate = toDate(post.getPeriod().getCreatedDate());
        this.lastModifiedDate = toDate(post.getPeriod().getLastModifiedDate());
        this.isVerified = email.equals(post.getAuthor().getEmail());
        this.hasLiked = post.getLikes().stream()
                .anyMatch(member -> email.equals(member.getEmail()));
    }
    //Todo: isCompleted를 반환할 것인지 상의 -> 반환 한다면 tag 형식으로 표시하면 좋을 것 같음.
}
