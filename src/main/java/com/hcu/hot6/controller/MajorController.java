package com.hcu.hot6.controller;

import com.hcu.hot6.domain.enums.Major;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MajorController {

    @GetMapping("/major")
    public Map<String, List<Major>> majorAutoCompletion(@RequestParam String q) {

        List<Major> list =
                Arrays.stream(Major.values()).filter(major -> major.toKor().contains(q)).toList();

        return Collections.singletonMap("results", list);
    }
}
