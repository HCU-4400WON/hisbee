package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

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

    }
    //Todo: isCompleted를 반환할 것인지 상의 -> 반환 한다면 tag 형식으로 표시하면 좋을 것 같음.
}
