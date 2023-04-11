package com.hcu.hot6.service;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class KeywordService {

    private final KeywordRepository keywordRepository;

    public List<String> addKeywords(List<String> keywords, TagForm tags) {
        final List<String> list = new ArrayList<>();

        keywords.addAll(tags.getFirst());
        keywords.addAll(tags.getSecond());
        keywords.forEach(name -> keywordRepository.findByName(name)
                .ifPresentOrElse(
                        Keyword::countUp,
                        () -> list.add(keywordRepository.save(new Keyword(name)))));
        return list;
    }
}
