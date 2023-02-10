package com.hcu.hot6.security;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.oauth.OAuth2UserDetails;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MemberRepository memberRepository;
    private final JwtService jwtService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(this.oAuth2UserService()))
                        .successHandler(this.oAuth2SuccessHandler())
                );
        return http.build();
    }

    private AuthenticationSuccessHandler oAuth2SuccessHandler() {
        final DefaultRedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

        return (request, response, authentication) -> {
            OAuth2User userinfo = (OAuth2User) authentication.getPrincipal();
            String email = userinfo.getAttribute("email");
            String accessToken = jwtService.generateToken(email);

            String targetUrl = UriComponentsBuilder.fromUriString("/oauth2/redirect")
                    .queryParam("token", accessToken)
                    .build().toUriString();

            redirectStrategy.sendRedirect(request, response, targetUrl);
        };
    }

    private OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

        return userRequest -> {
            OAuth2User oAuth2User = delegate.loadUser(userRequest);
            OAuth2UserDetails userDetails = new OAuth2UserDetails(oAuth2User.getAttributes());
            Optional<Member> registered = memberRepository.findMemberById(userDetails.getUid());

            if (registered.isEmpty()) {
                Member member = Member.builder()
                        .uid(userDetails.getUid())
                        .email(userDetails.getEmail())
                        .pictureUrl(userDetails.getPicture())
                        .build();
                memberRepository.register(member);
            }
            return oAuth2User;
        };
    }

    // In development only
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(new AntPathRequestMatcher("/h2-console/**"));
    }
}
