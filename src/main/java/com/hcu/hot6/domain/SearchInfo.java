package com.hcu.hot6.domain;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SearchInfo {

    @NotNull
    private int page;
    private String search;
    @NotNull
    private String order;
    @NotNull
    private String type;
    private String position;
    private boolean pay;
    @NotNull
    private int limit;
}
