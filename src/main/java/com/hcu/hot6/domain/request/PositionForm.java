package com.hcu.hot6.domain.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PositionForm {

    private String name;
    private int count;
}
