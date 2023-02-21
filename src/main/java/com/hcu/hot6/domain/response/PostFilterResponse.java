package com.hcu.hot6.domain.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostFilterResponse {

    private String dtype;

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;
    private int maxMember;
    private int maxMentor;
    private int maxMentee;
    private int total;

    private String title;
    private Date postStart;
    private Date projectStart;
}
