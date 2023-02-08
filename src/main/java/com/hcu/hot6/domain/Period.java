package com.hcu.hot6.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@Embeddable
public class Period {

    @Column(nullable = false)
    private LocalDateTime postStart;
    @Column(nullable = false)
    private LocalDateTime postEnd;
    @Column(nullable = false)
    private LocalDateTime projectStart;
    @Column(nullable = false)
    private LocalDateTime projectEnd;
}
