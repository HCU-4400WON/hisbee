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
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Repository;

import java.util.*;

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
                        eqKeywords(filter.getKeywords()),
                        eqDepartment(filter.getDepartment()),
                        post.archive.isNull()
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
                        eqKeywords(filter.getKeywords()),
                        eqDepartment(filter.getDepartment()),
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

    public Long count(PostSearchFilter filter) {
        return query.select(post.count())
                .from(post)
                .where(

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

    private BooleanBuilder eqDepartment(String department) {
        var builder = new BooleanBuilder();

        List<String> majors = new ArrayList<>();
        if(department.compareTo("ICT창업학부") == 0){
            majors.add("GE");
            majors.add("ICT융합");
            majors.add("ACE");
        }
        else if(department.compareTo("국제어문학부") == 0){
            majors.add("국제지역학");
            majors.add("영어");
        }
        else if(department.compareTo("생명공학부") == 0){
            majors.add("생명공학부");
        }
        else if(department.compareTo("경영경제학부") == 0){
            majors.add("경영학");
            majors.add("경제학");
            majors.add("GM");
        }
        else if(department.compareTo("법학부") == 0){
            majors.add("한국법");
            majors.add("UIL");
        }
        else if(department.compareTo("상담심리사회복지학부") == 0){
            majors.add("상담심리학");
            majors.add("사회복지학");
        }
        else if(department.compareTo("커뮤니케이션학부") == 0){
            majors.add("언론정보학");
            majors.add("공연영상학");
        }
        else if(department.compareTo("공간환경시스템공학부") == 0){
            majors.add("건설공학");
            majors.add("도시환경공학");
        }
        else if(department.compareTo("기계제어공학부") == 0){
            majors.add("기계공학");
            majors.add("전자제어공학");
        }
        else if(department.compareTo("전산전자공학부") == 0){
            majors.add("AI컴퓨터공학심화");
            majors.add("컴퓨터공학");
            majors.add("전자공학심화");
            majors.add("전자공학");
            majors.add("IT");

        }
        else if(department.compareTo("콘텐츠융합디자인학부") == 0){
            majors.add("시각디자인");
            majors.add("제품디자인");
        }

        if(department.compareTo("ICT창업학부") == 0 || department.compareTo("경영경제학부") == 0){
            return builder
                    .or(post.targetDepartment.contains(department))
                    .or(post.targetDepartment.contains(majors.get(0)))
                    .or(post.targetDepartment.contains(majors.get(1)))
                    .or(post.targetDepartment.contains(majors.get(2)));
        }
        else if(department.compareTo("전산전자공학부") == 0){
            return builder
                    .or(post.targetDepartment.contains(department))
                    .or(post.targetDepartment.contains(majors.get(0)))
                    .or(post.targetDepartment.contains(majors.get(1)))
                    .or(post.targetDepartment.contains(majors.get(2)))
                    .or(post.targetDepartment.contains(majors.get(3)))
                    .or(post.targetDepartment.contains(majors.get(4)));
        }

        return builder
                .or(post.targetDepartment.contains(department))
                .or(post.targetDepartment.contains(majors.get(0)))
                .or(post.targetDepartment.contains(majors.get(1)));
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
