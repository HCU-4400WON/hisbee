package com.hcu.hot6.domain.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PositionForm {

    public PositionForm(String name, int count) {
        this.name = name;
        this.count = count;
    }

    private String name;
    private int count;
}
