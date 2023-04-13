package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
public class Archive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "archive")
    private Post post;
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @CreatedDate
    private LocalDateTime createdDate;

    public Archive(Post post, Member member) {
        this.post = post;
        this.member = member;
        member.getArchives().add(this);
    }
}
