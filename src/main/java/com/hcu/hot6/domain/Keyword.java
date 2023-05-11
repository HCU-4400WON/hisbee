package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(value = AuditingEntityListener.class)
public class Keyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_id")
    private Long id;

    private String name;

    private Long count;

    @OneToMany(mappedBy = "keyword")
    private List<PostKeyword> postKeywords = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdDate;

    public Keyword(String name) {
        this.name = name;
        this.count = 1L;
    }

    public void countUp() {
        count++;
    }

    public Keyword countDown() {
        if (count == 1L) {
            postKeywords.clear();
        }
        count--;
        return this;
    }
}
