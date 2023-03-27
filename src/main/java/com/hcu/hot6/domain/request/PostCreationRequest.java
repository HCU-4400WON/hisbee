package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.Duration;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class PostCreationRequest {

    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;

    private int total;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date postStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date postEnd;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date projectStart;

    private List<String> keywords;
    private List<Duration> durations;
}
