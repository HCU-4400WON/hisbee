package com.hcu.hot6.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final static long ACCESS_TOKEN_EXPIRY = 3600L; // 1 hour

    public String generateToken(String email) {
        Instant now = Instant.now();

        return Jwts
                .builder()
                .setSubject(email)
                .setIssuedAt(new Date(now.toEpochMilli()))
                .setExpiration(new Date(now.plusSeconds(ACCESS_TOKEN_EXPIRY).toEpochMilli()))
                .signWith(key)
                .compact();
    }
}
