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

    // Thumbnail
    @NotNull
    private String title;
    private String summary;
    private List<String> tags;

    // Metadata
    @NotNull
    private List<String> postTypes;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitEnd;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date projectStart;

    @NotNull
    private List<Duration> durations;

    @NotNull
    private String targetCount;

    @NotNull
    private String contact;

    // Optional fields
    private String contactDetails;
    private String content;
    private List<String> years;
    private List<String> departments;
    private List<String> keywords;
    private List<String> posterPaths;
}
