package com.hcu.hot6.repository;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.enums.PostType;
import com.hcu.hot6.domain.enums.PostTypeDetails;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.querydsl.core.types.EntityPath;
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
import java.util.Objects;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final EntityManager em;
    private final JPAQueryFactory query;
    private final QPost post = QPost.post;
    private final QProject project = QProject.project;
    private final QMentoring mentoring = QMentoring.mentoring;
    private final QStudy study = QStudy.study;

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
        var entityPath = getEntityPath(filter.getType());

        return query.selectFrom(post)
                .join(entityPath)
                .where(
                        eqType(filter.getType()),
                        eqSearch(filter.getSearch()),
                        eqPosition(filter.getTypeDetails()),
                        eqPay(filter.getType(), filter.getHasPay())
                )
                .offset(offset)
                .limit(Pagination.LIMIT)
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public List<Post> findAll(PostSearchFilter filter) {
        var entityPath = getEntityPath(filter.getType());

        return query.selectFrom(post)
                .join(entityPath)
                .where(
                        eqType(filter.getType()),
                        eqSearch(filter.getSearch()),
                        eqPosition(filter.getTypeDetails()),
                        eqPay(filter.getType(), filter.getHasPay())
                )
                .orderBy(orderCond(filter.getOrderBy()))
                .fetch();
    }

    public Long count(PostSearchFilter filter) {
        var entityPath = getEntityPath(filter.getType());

        return query.select(post.count())
                .from(post)
                .join(entityPath)
                .where(
                        eqType(filter.getType()),
                        eqSearch(filter.getSearch()),
                        eqPosition(filter.getTypeDetails()),
                        eqPay(filter.getType(), filter.getHasPay())
                )
                .fetchOne();
    }

    private EntityPath<?> getEntityPath(PostType type) {
        if (Objects.isNull(type)) return post;

        switch (type) {
            case PROJECT -> {
                return project;
            }
            case STUDY -> {
                return study;
            }
            case MENTORING -> {
                return mentoring;
            }
        }
        return post;
    }

    private BooleanExpression eqType(PostType type) {
        return (Objects.isNull(type)) ? null : post.dtype.eq(type.getAbbr());
    }

    private BooleanExpression eqSearch(String keyword) {
        return (Strings.isBlank(keyword)) ? null : post.title.contains(keyword);
    }

    private BooleanExpression eqPosition(PostTypeDetails position) {
        if (Objects.isNull(position)) return null;

        switch (position) {
            case PLANNER -> {
                return project.maxPlanner.gt(0);
            }
            case DESIGNER -> {
                return project.maxDesigner.gt(0);
            }
            case DEVELOPER -> {
                return project.maxDeveloper.gt(0);
            }
            case MENTOR -> {
                return mentoring.maxMentor.gt(0);
            }
            case MENTEE -> {
                return mentoring.maxMentee.gt(0);
            }
            case MEMBER -> {
                return study.maxMember.gt(0);
            }
        }
        return null;
    }

    private BooleanExpression eqPay(PostType type, Boolean hasPay) {
        if (Objects.isNull(hasPay)) return null;

        switch (type) {
            case PROJECT -> {
                return project.hasPay.eq(hasPay);
            }
            case MENTORING -> {
                return mentoring.hasPay.eq(hasPay);
            }
            case STUDY -> {
                return null;
            }
        }
        return null;
    }

    private OrderSpecifier<?> orderCond(OrderBy orderBy) {
        switch (orderBy) {
            case RECENT -> {
                return post.period.postStart.desc();
            }
            case LIKES -> {
                return post.likes.size().desc();
            }
            case MEMBER -> {
                return post.remaining.asc();
            }
            case END -> {
                return post.period.projectEnd.asc();
            }
        }
        return new OrderSpecifier<>(
                Order.ASC,
                new NullExpression<>(OrderBy.class));
    }
}
