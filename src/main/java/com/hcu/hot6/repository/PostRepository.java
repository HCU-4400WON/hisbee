package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Post;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final EntityManager em;

    public Post save(Post post){
        em.persist(post);
        return post;
    }
}
