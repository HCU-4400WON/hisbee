package com.hcu.hot6.controller;

import com.hcu.hot6.service.KeywordService;
import com.hcu.hot6.util.Utils;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;

    @GetMapping("/keyword")
    public Map<String, List<String>> keywordAutoCompletion(@RequestParam String q) {
        return Collections.singletonMap("results", keywordService.keywordAutoCompletion(q));
    }

    @GetMapping("/keyword-suggestions")
    public Map<String, List<String>> relatedKeywords(@RequestParam String q) {
        List<String> keywords = Utils.toArray(q, ",");
        List<String> results = keywordService.suggestKeyword(keywords);

        return Collections.singletonMap("results", results);
    }
}
