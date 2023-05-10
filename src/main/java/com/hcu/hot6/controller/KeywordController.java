package com.hcu.hot6.controller;

import com.hcu.hot6.domain.enums.Major;
import com.hcu.hot6.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;

    @GetMapping("/keyword")
    public Map<String, List<String>> keywordAutoCompletion(@RequestParam String q) {
        return Collections.singletonMap("results", keywordService.keywordAutoCompletion(q));
    }
}
