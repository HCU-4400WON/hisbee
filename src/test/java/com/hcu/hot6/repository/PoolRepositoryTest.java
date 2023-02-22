package com.hcu.hot6.repository;

import com.hcu.hot6.domain.Department;
import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Position;
import com.hcu.hot6.domain.filter.PoolSearchFilter;
import com.hcu.hot6.domain.request.MemberRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
class PoolRepositoryTest {

    @PersistenceContext
    EntityManager em;

    @Autowired
    PoolRepository poolRepository;

    private final static String TEST_EMAIL = "test@example.com";

    @Test
    void 모든_필터에_해당하는_결과_개수_일치() {
        PoolSearchFilter filter = PoolSearchFilter.builder()
                .page(1)
                .department(Department.CSEE)
                .position(Position.DEVELOPER)
                .grade("1")
                .build();

        for (int i = 0; i < 100; ++i) {
            Member member = Member.builder()
                    .uid("uid")
                    .pictureUrl("pictureUrl")
                    .email(TEST_EMAIL)
                    .build();

            member.update(MemberRequest.builder()
                    .nickname("username")
                    .department(Department.CSEE)
                    .position(Position.DEVELOPER)
                    .grade("1")
                    .isPublic(true)
                    .build());
            em.persist(member);
        }
        assertThat(poolRepository.count(filter)).isEqualTo(100);
    }

    @Test
    public void 검색_필터에_해당하는_데이터_조회() throws Exception {
        // given
        PoolSearchFilter filter = PoolSearchFilter.builder()
                .page(1)
                .department(Department.CSEE)
                .position(Position.DEVELOPER)
                .grade("1")
                .build();
        Random random = new Random();
        // when
        for (int i = 0; i < 3; ++i) {
            Member member = Member.builder()
                    .uid("uid")
                    .pictureUrl("pictureUrl")
                    .email(TEST_EMAIL)
                    .build();

            member.update(MemberRequest.builder()
                    .nickname("username")
                    .department(Department.CSEE)
                    .position(Position.DEVELOPER)
                    .grade("1")
                    .isPublic(true)
                    .build());
            em.persist(member);
        }

        for (int i = 0; i < 9; ++i) {
            Member member = Member.builder()
                    .uid("uid")
                    .pictureUrl("pictureUrl")
                    .email(TEST_EMAIL)
                    .build();

            member.update(MemberRequest.builder()
                    .nickname("username")
                    .department(Department.CSEE)
                    .position(Position.DEVELOPER)
                    .grade("2")
                    .isPublic(true)
                    .build());
            em.persist(member);
        }
        // then
        assertThat(poolRepository.matchWith(filter, 0)).hasSize(3);
    }
}