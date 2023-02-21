package com.hcu.hot6.repository;

import com.hcu.hot6.domain.*;
import com.hcu.hot6.domain.filter.PoolSearchFilter;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PoolRepository {
    private final JPAQueryFactory query;
    private final QMember qMember = QMember.member;

    public List<Member> matchWith(PoolSearchFilter filter, long offset) {
        return query.selectFrom(qMember)
                .where(
                        eqDepartment(filter.getDepartment()),
                        eqPosition(filter.getPosition()),
                        eqGrade(filter.getGrade())
                ).limit(Pagination.LIMIT)
                .offset(offset)
                .orderBy(NumberExpression.random().asc())
                .fetch();
    }

    public Long count(PoolSearchFilter filter) {
        return query.select(qMember.count())
                .from(qMember)
                .where(
                        eqDepartment(filter.getDepartment()),
                        eqPosition(filter.getPosition()),
                        eqGrade(filter.getGrade())
                ).fetchOne();
    }

    private BooleanExpression eqDepartment(Department department) {
        return (department == null) ? null : qMember.department.eq(department);
    }

    private BooleanExpression eqPosition(Position position) {
        return (position == null) ? null : qMember.position.eq(position);
    }

    private BooleanExpression eqGrade(String grade) {
        return (StringUtils.hasText(grade)) ? qMember.grade.eq(grade) : null;
    }

}
