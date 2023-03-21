package com.hcu.hot6.domain.filter;

import com.hcu.hot6.domain.enums.OrderBy;
import lombok.Builder;
import lombok.Getter;

import java.util.Objects;

@Getter
public class PostSearchFilter {

    @Builder
    public PostSearchFilter(Integer page,
                            String search,
                            OrderBy orderBy,
                            Integer limit) {
        this.page = page;
        this.search = search;
        this.orderBy = (Objects.isNull(orderBy)) ? OrderBy.RECENT : orderBy;
        this.limit = limit;
    }

    private final Integer page;
    private final String search;
    private final OrderBy orderBy;
    private final Integer limit;
}
