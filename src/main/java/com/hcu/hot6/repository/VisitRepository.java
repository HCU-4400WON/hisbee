package com.hcu.hot6.repository;

import com.hcu.hot6.domain.VisitCount;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VisitRepository {
    private final EntityManager em;

    public void save(VisitCount visitCount){
        em.persist(visitCount);
    }
}
