package com.hcu.hot6.service;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.PostKeyword;
import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.repository.KeywordRepository;
import com.hcu.hot6.repository.PostKeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KeywordService {

    private final KeywordRepository keywordRepository;
    private final PostKeywordRepository postKeywordRepository;

    public List<Keyword> addKeywords(Post post, PostCreationRequest request) {
        final List<Keyword> keywords = new ArrayList<>();
        final List<String> labels = new ArrayList<>(request.getKeywords())
                .stream()
                .filter(label -> !post.getPostTypes().contains(label))
                .toList();

        labels.forEach(name ->
                keywordRepository.findByName(name)
                        .ifPresentOrElse(
                                existingKeyword -> {
                                    existingKeyword.countUp();
                                    keywords.add(existingKeyword);
                                },
                                () -> {
                                    Keyword keyword = new Keyword(name);
                                    keywordRepository.save(keyword);
                                    keywords.add(keyword);
                                }));
        keywords
                .forEach(keyword ->
                        postKeywordRepository.save(new PostKeyword(post, keyword)));
        return keywords;
    }

    public List<String> suggestKeyword(List<String> targets) {
        List<Keyword> keywords = postKeywordRepository.findByName(targets);

        List<Post> posts = keywords.stream()
                .flatMap(keyword -> keyword.getPostKeywords().stream())
                .collect(Collectors.groupingBy(PostKeyword::getPost, Collectors.counting()))
                .keySet().stream()
                .toList();

        Map<Keyword, Long> frequency = posts.stream()
                .flatMap(post -> post.getPostKeywords().stream())
                .collect(Collectors.groupingBy(PostKeyword::getKeyword, Collectors.counting()));

        List<Keyword> sorted = frequency.entrySet().stream()
                .sorted(Map.Entry.<Keyword, Long>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        return sorted.stream()
                .filter(keyword -> targets.isEmpty() || !keywords.contains(keyword))
                .map(Keyword::getName)
                .limit(10)
                .toList();
    }

    public List<String> keywordAutoCompletion(String q) {
        final List<Keyword> list = keywordRepository.keywordAutoCompletion(q);
        List<String> keywordNameList = new ArrayList<>();
        list.forEach(keyword -> keywordNameList.add(keyword.getName()));
        return keywordNameList;
    }

    public List<Keyword> findAll() {
        return keywordRepository.findAll();
    }
}
