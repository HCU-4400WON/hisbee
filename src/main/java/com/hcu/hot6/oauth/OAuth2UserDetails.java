package com.hcu.hot6.oauth;

import lombok.Getter;

import java.util.Map;

@Getter
public class OAuth2UserDetails {
    private final String uid;
    private final String email;
    private final String picture;

    public OAuth2UserDetails(Map<String, Object> attributes) {
        this.uid = (String) attributes.get("sub");
        this.email = (String) attributes.get("email");
        this.picture = (String) attributes.get("picture");
    }
}
