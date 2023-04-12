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

    public void save(Likes like) {
        em.persist(like);
    }

    public Long delete(Likes like) {
        em.remove(like);
        return like.getId();
    }

    public Likes findOne(Post post, Member member){
        return (Likes) em.createQuery("SELECT l FROM Likes l WHERE l.member.id = member.id AND l.post.id = post.id")
                .getResultList();
    }

}
