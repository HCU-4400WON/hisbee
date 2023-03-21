package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.QPost;
import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.querydsl.core.types.NullExpression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final EntityManager em;
    private final JPAQueryFactory query;
    private final QPost post = QPost.post;

    public void save(Post post) {
        em.persist(post);
    }

    public Long delete(Post post) {
        em.remove(post);
        return post.getId();
    }

    public Optional<Post> findOne(Long postId) {
        return Optional.ofNullable(em.find(Post.class, postId));
    }

    public List<Post> findAll(PostSearchFilter filter, long offset) {
        return query.selectFrom(post)
                .where(
                        eqSearch(filter.getSearch())
                )
                .offset(offset)
                .limit(Pagination.LIMIT)
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public List<Post> findAll(PostSearchFilter filter) {
        return query.selectFrom(post)
                .where(
                        eqSearch(filter.getSearch())
                )
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public Long count(PostSearchFilter filter) {
        return query.select(post.count())
                .from(post)
                .where(
                        eqSearch(filter.getSearch())
                )
                .fetchOne();
    }

    private BooleanExpression eqSearch(String keyword) {
        return (Strings.isBlank(keyword)) ? null : post.title.contains(keyword);
    }

    private OrderSpecifier<?> orderCond(OrderBy orderBy) {
        switch (orderBy) {
            case RECENT -> {
                return post.period.createdDate.desc();
            }
            case LIKES -> {
                return post.likes.size().desc();
            }
            case MEMBER -> {
                return post.remaining.asc();
            }
            case END -> {
                return post.period.postEnd.asc();
            }
        }
        return new OrderSpecifier<>(
                Order.ASC,
                new NullExpression<>(OrderBy.class));
    }
}
