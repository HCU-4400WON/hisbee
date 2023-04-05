package com.hcu.hot6.service;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeywordService {

    private final KeywordRepository keywordRepository;

    public List<String> addKeywords(List<String> keywords, List<String> tags) {
        final List<String> flatTags = tags.stream()
                .flatMap(tag -> Arrays.stream(tag.split(",")))
                .toList();
        final List<String> list = new ArrayList<>();

        keywords.addAll(flatTags);
        keywords.forEach(name -> keywordRepository.findByName(name)
                .ifPresentOrElse(
                        Keyword::countUp,
                        () -> list.add(keywordRepository.save(new Keyword(name))))
        );
        return list;
    }
}
