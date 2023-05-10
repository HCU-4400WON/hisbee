package com.hcu.hot6.service;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.domain.request.TagForm;
import com.hcu.hot6.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class KeywordService {

    private final KeywordRepository keywordRepository;

    public List<String> addKeywords(List<String> keywords, TagForm tags) {
        final List<String> list = new ArrayList<>();

        List<String> keywordList = new ArrayList<>();
        keywordList.addAll(keywords);
        keywordList.addAll(tags.getFirst());
        keywordList.addAll(tags.getSecond());
        keywordList.forEach(name -> keywordRepository.findByName(name)
                .ifPresentOrElse(
                        Keyword::countUp,
                        () -> list.add(keywordRepository.save(new Keyword(name)))));
        return list;
    }

    public List<String> keywordAutoCompletion(String q) {
        final List<Keyword> list = keywordRepository.keywordAutoCompletion(q);
        List<String> keywordNameList = new ArrayList<>();
        list.stream().forEach(keyword -> keywordNameList.add(keyword.getName()));
        return keywordNameList;
    }

    public List<Keyword> findAll(){
        return keywordRepository.findAll();
    }
}
