package com.hcu.hot6.config;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.filter.JwtAuthorizationFilter;
import com.hcu.hot6.repository.MemberRepository;
import com.hcu.hot6.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MemberRepository memberRepository;
    private final JwtService jwtService;

    @Value("${custom.host.client}")
    private String client;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                        .requestMatchers(HttpMethod.GET, "/posts/**", "/users/validation").permitAll()
                        .requestMatchers(HttpMethod.GET, "/favicon.ico").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(this.oAuth2UserService()))
                        .successHandler(this.oAuth2SuccessHandler()))
                .addFilterBefore(this.jwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(config -> config
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(handler -> handler
                        .authenticationEntryPoint(this.oAuth2AuthenticationEntryPoint()));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(client));
        config.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList(HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() {
        return new JwtAuthorizationFilter(jwtService);
    }

    private AuthenticationEntryPoint oAuth2AuthenticationEntryPoint() {
        return (request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    private AuthenticationSuccessHandler oAuth2SuccessHandler() {
        final DefaultRedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

        return (request, response, authentication) -> {
            OAuth2User userinfo = (OAuth2User) authentication.getPrincipal();
            String email = userinfo.getAttribute("email");

            String accessToken = jwtService.generateToken(email);
            Member member = memberRepository.findByEmail(email).orElseThrow();

            String targetUrl = UriComponentsBuilder.fromUriString(client)
                    .path("oauth2/redirect")
                    .queryParam("token", accessToken)
                    .queryParam("hasRegistered", member.isRegistered())
                    .build().toUriString();

            redirectStrategy.sendRedirect(request, response, targetUrl);
        };
    }

    private OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

        return userRequest -> {
            OAuth2User oAuth2User = delegate.loadUser(userRequest);
            Optional<Member> registered = memberRepository.findMemberById(oAuth2User.getName());

            if (registered.isEmpty()) {
                Member member = Member.builder()
                        .uid(oAuth2User.getAttribute("sub"))
                        .email(oAuth2User.getAttribute("email"))
                        .pictureUrl(oAuth2User.getAttribute("picture"))
                        .isRegistered(false)
                        .build();
                memberRepository.save(member);
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
