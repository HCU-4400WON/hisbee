package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.QPost;
import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.NullExpression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
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
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords())
                )
                .offset(offset)
                .limit(Pagination.LIMIT)
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public List<Post> findAll(PostSearchFilter filter) {
        return query.selectFrom(post)
                .where(
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords())
                )
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public Long count(PostSearchFilter filter) {
        return query.select(post.count())
                .from(post)
                .where(
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords())
                )
                .fetchOne();
    }

    private BooleanExpression eqType(String type) {
        return post.postTypes.contains(type);
    }

    private BooleanBuilder eqKeywords(List<String> keywords) {
        var builder = new BooleanBuilder();

        return builder
                .or(
                        keywords.stream()
                                .map(post.keywords::contains)
                                .reduce(BooleanExpression::or)
                                .orElse(null))
                .or(
                        keywords.stream()
                                .map(post.thumbnail.tags::contains)
                                .reduce(BooleanExpression::or)
                                .orElse(null)
                );
    }

    private OrderSpecifier<?> orderCond(OrderBy orderBy) {
        switch (orderBy) {
            case RECENT -> {
                return post.createdDate.desc();
            }
            case LIKES -> {
                return post.bookmarks.size().desc();
            }
            case END -> {
                return post.thumbnail.recruitEnd.asc();
            }
        }
        return new OrderSpecifier<>(
                Order.ASC,
                new NullExpression<>(OrderBy.class));
    }
}
