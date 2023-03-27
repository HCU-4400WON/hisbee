package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.Duration;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class PostUpdateRequest {
    private String title;
    private String content;
    private String contact;
    private int total;
    private int curr;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date postStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date postEnd;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date projectStart;

    private List<Duration> durations;
    private List<String> keywords;
    private boolean isCompleted;
}
