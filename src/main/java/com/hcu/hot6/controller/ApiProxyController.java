package com.hcu.hot6.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ApiProxyController {

    @GetMapping("/nickname")
    public String fetchNickname() {
        RestTemplate restTemplate = new RestTemplate();
        String resourceUrl = "https://nickname.hwanmoo.kr/?format=json&max_length=8";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(resourceUrl, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred";
        }
    }
}
