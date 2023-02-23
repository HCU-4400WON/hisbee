package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final EntityManager em;

    public void save(Post post){
        em.persist(post);
    }

    public Long delete(Post post) {
        em.remove(post);
        return post.getId();
    }

    public Optional<Post> findOne(Long postId) {
        return Optional.ofNullable(em.find(Post.class, postId));
    }

    public List<Post> findAll(PostSearchFilter searchInfo) {
        //language=JPAQL
        String jpql = "select p From Post p";
        boolean isFirstCondition = true;

        // 모집글 유형 검색
        if (searchInfo.getType() != null) {
            if (isFirstCondition) {
                jpql += " where";
                isFirstCondition = false;
            } else {
                jpql += " and";
            }
            jpql += " p.dtype = :dtype";
        }

        // 포지션 별 검색

        // 페이 유무 검색
        if (searchInfo.getType().compareTo("P") == 0|| searchInfo.getType().compareTo("M") == 0) {
            if (isFirstCondition) {
                jpql += " where";
                isFirstCondition = false;
            } else {
                jpql += " and";
            }

            jpql += " p.hasPay = :hasPay";
        }


        // 키워드 검색
        if (StringUtils.hasText(searchInfo.getSearch())) {
            if (isFirstCondition) {
                jpql += " where";
                isFirstCondition = false;
            } else {
                jpql += " and";
            }
            jpql += " p.title like :title";
        }

        // 정렬 검색
        if (searchInfo.getOrder() != null) {
            // 최신순 검색
            if(searchInfo.getOrder().compareTo("recent") == 0) jpql += " order by p.postStart desc";
        }

        TypedQuery<Post> query = em.createQuery(jpql, Post.class)
                .setFirstResult((searchInfo.getPage() - 1) * searchInfo.getLimit())
                .setMaxResults(searchInfo.getLimit());

        if (searchInfo.getType() != null) {
            query = query.setParameter("dtype", searchInfo.getType());
        }
        if (StringUtils.hasText(searchInfo.getSearch())) {
            query = query.setParameter("title", searchInfo.getSearch());
        }
        if (searchInfo.getType().compareTo("P") == 0|| searchInfo.getType().compareTo("M") == 0) {
            query = query.setParameter("hasPay", searchInfo.isPay());
        }
        return query.getResultList();

    }


}
