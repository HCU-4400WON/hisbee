package com.hcu.hot6.domain.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PostUpdateRequest {

    private String dtype;

    private String title;
    private String content;
    private String contact;
    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;
    private int maxMentor;
    private int maxMentee;
    private int maxMember;
    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;
    private int currMentor;
    private int currMentee;
    private int currMember;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime postEnd;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime projectStart;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime projectEnd;

    private boolean isCompleted;


    private boolean hasPay;
}
