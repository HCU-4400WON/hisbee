package com.hcu.hot6.domain.response;

import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class PostFilterResponse {
    private final long total;
    private final List<String> relatedKeywords;
    private final List<PostThumbnailResponse> posts;
}
