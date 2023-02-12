package com.hcu.hot6.domain.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PostCreationRequest {

    @NotNull
    private String dtype;
    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;

    @NotNull
    private Long authorId;

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

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Future
    @NotNull
    private LocalDateTime postEnd;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Future
    @NotNull
    private LocalDateTime projectStart;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Future
    @NotNull
    private LocalDateTime projectEnd;

    private boolean hasPay;


}
