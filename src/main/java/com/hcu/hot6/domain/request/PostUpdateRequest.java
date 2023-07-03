package com.hcu.hot6.domain.request;

import java.util.Date;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.format.annotation.DateTimeFormat;

@Builder
@Getter
public class PostUpdateRequest {

    // #1
    private String title;
    private String summary;
    private TagForm tags;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitEnd;

    private List<String> postTypes;
    private String contact;
    private String contactDetails;

    // #2
    private List<String> years;
    private List<String> departments;
    private String qualifications;
    private String targetCount;
    private String duration;

    // #3
    private List<String> keywords;

    // #4
    private String content;

    // #5
    //    private List<String> addPosterPaths;
    //    private List<String> delPosterPaths;
    private List<String> posterPaths;

    //
    private Boolean isClosed;
    private Boolean isETC;
}
