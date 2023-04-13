package com.hcu.hot6.domain.response;

import com.hcu.hot6.util.Utils;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
public class ArchiveResponse {

    public ArchiveResponse(Long id) {
        this.id = id;
    }

    public ArchiveResponse(Long id, LocalDateTime createdDate) {
        this.id = id;
        this.createdDate = Utils.toDate(createdDate);
    }

    private final Long id;
    private Date createdDate;
}
