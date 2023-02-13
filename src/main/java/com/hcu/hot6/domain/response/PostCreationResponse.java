package com.hcu.hot6.domain.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PostCreationResponse {

    private final Long id;
    private final String title;
    private final String dtype;
}
