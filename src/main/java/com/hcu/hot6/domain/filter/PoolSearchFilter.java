package com.hcu.hot6.domain.filter;

import com.hcu.hot6.domain.Department;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PoolSearchFilter {
    private int page;
    private Department department;
    //private Position position;
    private String grade;
}
