package com.hcu.hot6.service;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.oauth.OAuth2UserDetails;
import com.hcu.hot6.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2UserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member =
                memberRepository
                        .findByEmail(username)
                        .orElseThrow(
                                () -> new UsernameNotFoundException("Cannot find match username=" + username));
        return new OAuth2UserDetails(member);
    }
}
