package com.hcu.hot6.domain.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class PostCreationRequest {

    @NotNull
    private String dtype;
    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;

    @PositiveOrZero
    private int maxMentor;
    @PositiveOrZero
    private int maxMentee;
    @PositiveOrZero
    private int maxMember;
    @PositiveOrZero
    private int maxDeveloper;
    @PositiveOrZero
    private int maxPlanner;
    @PositiveOrZero
    private int maxDesigner;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Future
    @NotNull
    private Date postEnd;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date projectStart;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Future
    @NotNull
    private Date projectEnd;

    private boolean hasPay;


}
