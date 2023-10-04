package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final EntityManager em;

    public Optional<Member> findMemberById(String uid) {
        return em
                .createQuery("select m from Member m where m.uid = :uid", Member.class)
                .setParameter("uid", uid)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Transactional
    public void save(Member info) {
        em.persist(info);
    }

    public String remove(Member info) {
        em.remove(info);
        return info.getEmail();
    }

    public Optional<Member> findByEmail(String email) {
        if (email == null) return Optional.empty();

        return em
                .createQuery("select m from Member m where email = :email", Member.class)
                .setParameter("email", email)
                .getResultList()
                .stream()
                .findFirst();
    }

    public Member findByNickname(String nickname) throws NoResultException {
        return em.createQuery("select m from Member m where nickname = :nickname", Member.class)
                .setParameter("nickname", nickname)
                .getSingleResult();
    }
}
