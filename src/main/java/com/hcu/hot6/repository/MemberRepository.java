package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final EntityManager em;

    public Member findById(Long authorId) {
        return em.find(Member.class, authorId);
    }
}
