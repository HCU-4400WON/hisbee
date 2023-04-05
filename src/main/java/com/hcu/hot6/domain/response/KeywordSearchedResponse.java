package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Keyword;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Getter
public class KeywordSearchedResponse {
    private final long total;
    private final List<Keyword> keywords;
}
