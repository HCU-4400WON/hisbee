package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PositionForm;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int count;

    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;

    public PositionForm toResponse() {
        return new PositionForm(name, count);
    }
}
