package com.hcu.hot6.domain;

import static java.lang.Math.min;

import lombok.Getter;

@Getter
public class Pagination {
    public static final long LIMIT = 12;
    private static final int PAGE_OFFSET = 5;

    public Pagination(int page, long total, int limit) {
        this.curr = page;
        this.total = total;
        this.pageEnd =
                min(
                        (int) (Math.ceil((double) curr / PAGE_OFFSET) * PAGE_OFFSET),
                        (int) Math.ceil((double) total / LIMIT));
        this.pageBegin = Math.max(1, pageEnd - (PAGE_OFFSET - 1));
        this.offset = (page - 1) * limit;
        this.limit = limit;
    }

    private final int curr;
    private final long total;

    private final int pageBegin;
    private final int pageEnd;

    private final long offset;
    private final int limit;
}
