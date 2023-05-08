package com.hcu.hot6.service;

import com.hcu.hot6.domain.VisitCount;
import com.hcu.hot6.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class VisitCountService {

    private final VisitRepository visitRepository;

    public void saveSessionInfo(VisitCount visitCount){
        visitRepository.save(visitCount);
    }
}
