package com.hcu.hot6.domain.response;

import com.hcu.hot6.util.Utils;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
public class PostModifiedResponse {

    public PostModifiedResponse(Long id, LocalDateTime lastModifiedDate) {
        this.id = id;
        this.lastModifiedDate = Utils.toDate(lastModifiedDate);
    }
    private final Long id;
    private final Date lastModifiedDate;
}
