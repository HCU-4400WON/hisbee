package com.hcu.hot6.domain;

import lombok.Getter;

import static java.lang.Math.min;

@Getter
public class Pagination {
    public final static long LIMIT = 12;
    private final static int PAGE_OFFSET = 5;

    public Pagination(int page, Long total) {
        this.curr = page;
        this.total = total;
        this.pageEnd = min(
                (int) (Math.ceil((double) curr / PAGE_OFFSET) * PAGE_OFFSET),
                (int) Math.ceil((double) total / LIMIT)
        );
        this.pageBegin = pageEnd - (PAGE_OFFSET - 1);
        this.offset = (page - 1) * LIMIT;
    }

    private final int curr;
    private final Long total;

    private final int pageBegin;
    private final int pageEnd;

    private final long offset;

}
