package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Likes;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Post;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LikesRepository {

    private final EntityManager em;

    public Likes save(Likes like) {
        em.persist(like);
        return like;
    }

    public Long delete(Likes like) {
        em.remove(like);
        return like.getId();
    }

    public Likes findOne(Post post, Member member) {
        return em.createQuery(
                        "select l from Likes l where l.member=:member and l.post=:post", Likes.class)
                .setParameter("post", post)
                .setParameter("member", member)
                .getSingleResult();
    }
}
