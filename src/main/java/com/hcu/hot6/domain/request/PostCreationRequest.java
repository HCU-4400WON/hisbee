package com.hcu.hot6.domain.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class PostCreationRequest {

    private String dtype;
    private String title;
    private String content;
    private String contact;

    private Long authorId;

    private int maxMentor;
    private int maxMentee;
    private int maxMember;
    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime postEnd;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime projectStart;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime projectEnd;

    private boolean hasPay;


}
