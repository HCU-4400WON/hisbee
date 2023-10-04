package com.hcu.hot6.domain.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostFilterResponse {
    private long total;
    private List<String> relatedKeywords;
    private List<PostThumbnailResponse> posts;
}
