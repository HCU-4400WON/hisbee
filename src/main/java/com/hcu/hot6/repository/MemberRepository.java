package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final EntityManager em;

    public Optional<Member> findMemberById(String uid) {
        return em.createQuery("select m from Member m where m.uid = :uid", Member.class)
                .setParameter("uid", uid)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Transactional
    public void register(Member info) {
        em.persist(info);
    }
}
