package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Post;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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

    public Post findOne(Long postId) {
        return em.find(Post.class, postId);
    }
}
