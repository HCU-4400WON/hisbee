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

    /*Todo: 키워드 필터링 테스트 미완*/
    private BooleanExpression eqSearch(String keyword) {
        //return (Strings.isBlank(keyword)) ? null : post.title.contains(keyword); // 기존 코드
        if(Strings.isBlank(keyword)) return null;

        String[] searchTokens = keyword.split(","); // 검색할 키워드 ,(콤마)로 분류

        int flag = 0;   // 키워드 포함 안됨 -> 필터링에서 걸러짐
        BooleanExpression be = null;
        for(int i=0; i<searchTokens.length; i++){   // 검색할 키워드 중, 하나라도 포함하고 있는 게시글인 fetch
            be = eqSearchOne(searchTokens[i]);
            if(be != null) {
                flag = 1;
                break;
            }
        }

        if(flag == 0) return null;  // 검색할 키워드 중, 아무것도 포함하고 있지 않은 게시글은 걸러짐
        return be;

    }

    private BooleanExpression eqSearchOne(String token){
        return post.keywordList.contains("," + token + ",");
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
