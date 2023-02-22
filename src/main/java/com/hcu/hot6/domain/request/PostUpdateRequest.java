package com.hcu.hot6.domain.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

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

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date postEnd;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date projectStart;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date projectEnd;

    private boolean isCompleted;


    private boolean hasPay;
}
