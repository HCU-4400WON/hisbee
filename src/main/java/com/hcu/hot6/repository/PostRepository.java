package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.QPost;
import com.hcu.hot6.domain.enums.Major;
import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.enums.Year;
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

import java.util.Arrays;
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

    public List<Post> findAll(PostSearchFilter filter,
                              Member member,
                              long offset,
                              int limit) {
        return query.selectFrom(post)
                .where(
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords()),
                        eqDepartment(filter.getDepartment()),
                        eqYear(filter.getYear()),
                        isMyDepartment(filter.getMyDeptOnly(), member),
                        post.archive.isNull()
                )
                .offset(offset)
                .limit(limit)
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public List<Post> findAll(PostSearchFilter filter, Member member) {
        return query.selectFrom(post)
                .where(
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords()),
                        eqDepartment(filter.getDepartment()),
                        eqYear(filter.getYear()),
                        isMyDepartment(filter.getMyDeptOnly(), member),
                        post.archive.isNull()
                )
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public List<Post> findAllArchived() {
        return query.selectFrom(post)
                .where(
                        post.archive.isNotNull()
                )
                .fetch();
    }

    public Long count(PostSearchFilter filter, Member member) {
        return query.select(post.count())
                .from(post)
                .where(
                        eqType(filter.getType()),
                        eqKeywords(filter.getKeywords()),
                        eqDepartment(filter.getDepartment()),
                        eqYear(filter.getYear()),
                        isMyDepartment(filter.getMyDeptOnly(), member),
                        post.archive.isNull()
                )
                .fetchOne();
    }

    private BooleanExpression eqType(String type) {
        if (type == null) return null;
        else if (type.equals("기타")) return post.isETC;
        return post.postTypes.contains(type);
    }

    private BooleanExpression eqYear(Year year) {
        return (year != null) ? post.targetYears.contains(year.toKor()) : null;
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
                )
                .or(
                        keywords.stream()
                                .map(post.thumbnail.title::contains)
                                .reduce(BooleanExpression::or)
                                .orElse(null)
                )
                .or(
                        keywords.stream()
                                .map(post.thumbnail.summary::contains)
                                .reduce(BooleanExpression::or)
                                .orElse(null)
                );
    }

    private BooleanExpression eqDepartment(Department department) {
        return Arrays.stream(Major.values())
                .filter(major -> major.getDepartment().equals(department))
                .map(major -> post.targetDepartment.contains(major.toKor()))
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

    private BooleanExpression isMyDepartment(Boolean myDeptOnly, Member member) {
        return (myDeptOnly != null)
                ? post.targetDepartment.contains(member.getMajor1().toKor())
                .or(post.targetDepartment.contains(member.getMajor2().toKor()))
                : null;
    }

    private OrderSpecifier<?> orderCond(OrderBy orderBy) {
        switch (orderBy) {
            case RECENT -> {
                return post.createdDate.desc();
            }
            case LIKES -> {
                return post.likes.size().desc();
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
