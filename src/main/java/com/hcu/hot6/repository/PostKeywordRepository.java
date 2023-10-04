package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Keyword;
import com.hcu.hot6.domain.PostKeyword;
import com.hcu.hot6.domain.QKeyword;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PostKeywordRepository {

    private final EntityManager em;
    private final JPAQueryFactory query;
    private final QKeyword keyword = QKeyword.keyword;

    public List<Keyword> findByName(List<String> targets) {
        return query.selectFrom(keyword).where(eqKeyword(targets)).fetch();
    }

    private BooleanExpression eqKeyword(List<String> targets) {
        return targets.stream().map(keyword.name::eq).reduce(BooleanExpression::or).orElse(null);
    }

    public void save(PostKeyword postKeyword) {
        em.persist(postKeyword);
    }
}
