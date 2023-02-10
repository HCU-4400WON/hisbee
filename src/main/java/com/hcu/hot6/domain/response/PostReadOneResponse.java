package com.hcu.hot6.domain.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReadOneResponse {

    private String dtype;
    private Long id;
    private String title;
    private String content;
    private String contact;
    private LocalDateTime postStart;
    private LocalDateTime postEnd;
    private LocalDateTime projectStart;
    private LocalDateTime projectEnd;
    private String writer;

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;
    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;

    private int maxMember;
    private int currMember;

    private int maxMentor;
    private int maxMentee;
    private int currMentor;
    private int currMentee;
    private boolean hasPay;

    //Todo: isCompleted를 반환할 것인지 상의 -> 반환 한다면 tag 형식으로 표시하면 좋을 것 같음.
}
