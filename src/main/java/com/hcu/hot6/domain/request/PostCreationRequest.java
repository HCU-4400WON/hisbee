package com.hcu.hot6.domain.request;

import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreationRequest {

    // #1
    @NotNull private String title;
    private String summary;
    private TagForm tags;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date recruitEnd;

    @NotNull private List<String> postTypes;

    @NotNull private String contact;
    private String contactDetails;

    // #2
    private List<String> years;
    private List<String> departments;
    private String qualifications;
    private String targetCount;

    @NotNull private String duration;

    // #3
    private List<String> keywords;

    // #4
    private String content;

    // #5
    private List<String> posterPaths;

    private boolean isETC;

    public TagForm getTags() {
        return Objects.requireNonNullElse(this.tags, new TagForm());
    }

    public String getTargetCount() {
        return Objects.requireNonNullElse(this.targetCount, "00명");
    }
}
