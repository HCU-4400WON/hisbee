package com.hcu.hot6.service;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.Pagination;
import com.hcu.hot6.domain.filter.PoolSearchFilter;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.repository.PoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final PoolRepository poolRepository;

    public Member updateMember(String email, MemberRequest form) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow();
        member.update(form);

        return member;
    }

    public String deleteMember(String email) {
        Optional<Member> member = memberRepository.findByEmail(email);

        return (member.isPresent())
                ? memberRepository.remove(member.get())
                : "";
    }

    public List<Member> getMatchedProfilesWith(PoolSearchFilter filter) {
        long offset = new Pagination(filter.getPage(), poolRepository.count(filter)).getOffset();
        return poolRepository.matchWith(filter, offset);
    }
}
