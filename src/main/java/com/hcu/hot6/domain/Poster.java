package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Poster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poster_id")
    private Long id;

    private String postURL;
    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;

    public Poster(String postURL, Post post) {
        this.postURL = postURL;
        this.post = post;
    }
}
