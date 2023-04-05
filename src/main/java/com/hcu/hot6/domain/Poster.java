package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Poster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poster_id")
    private Long id;

    private String postURL;
    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;
}
