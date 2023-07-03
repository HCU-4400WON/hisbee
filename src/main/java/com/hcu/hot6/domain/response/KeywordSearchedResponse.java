package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Keyword;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class KeywordSearchedResponse {
    private final long total;
    private final List<Keyword> keywords;
}
