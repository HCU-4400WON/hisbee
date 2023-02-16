package com.hcu.hot6.service;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.request.MemberRequest;
import com.hcu.hot6.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Member updateMember(String email, MemberRequest form) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow();
        member.update(form);

        return member;
    }

    @Transactional
    public String deleteMember(String email) {
        Optional<Member> member = memberRepository.findByEmail(email);

        return (member.isPresent())
                ? memberRepository.remove(member.get())
                : "";
    }
}
