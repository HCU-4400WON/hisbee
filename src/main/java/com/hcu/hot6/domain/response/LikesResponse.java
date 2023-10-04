package com.hcu.hot6.domain.response;

import static com.hcu.hot6.util.Utils.toDate;

import com.hcu.hot6.domain.Likes;
import java.util.Date;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LikesResponse {

    private Long id;
    private Long postId;
    private Long memberId;
    private Date cratedDate;

    public LikesResponse(Likes likes) {
        this.id = likes.getId();
        this.postId = likes.getPost().getId();
        this.memberId = likes.getMember().getId();
        this.cratedDate = toDate(likes.getCreatedDate());
    }
}
