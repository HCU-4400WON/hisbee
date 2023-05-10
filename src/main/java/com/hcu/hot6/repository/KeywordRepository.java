package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Keyword;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class KeywordRepository {
    private final EntityManager em;

    public String save(Keyword keyword) {
        em.persist(keyword);
        return keyword.getName();
    }

    public Optional<Keyword> findByName(String keyword) {
        return em.createQuery("select k from Keyword as k where k.name = :keyword", Keyword.class)
                .setParameter("keyword", keyword)
                .getResultStream()
                .findFirst();
    }

    public List<Keyword> keywordAutoCompletion(String q) {
        return em.createQuery("select k from Keyword as k where k.name like :q", Keyword.class)
                .setParameter("q", "%" + q + "%")
                .getResultList();

    }

    public List<Keyword> findAll(){
        return em.createQuery("select k from Keyword k", Keyword.class)
                .getResultList();
    }
}
