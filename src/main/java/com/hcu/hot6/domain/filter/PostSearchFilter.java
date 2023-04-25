package com.hcu.hot6.domain.filter;

import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.util.Utils;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Objects;

@Getter
public class PostSearchFilter {

    @Builder
    public PostSearchFilter(Integer page,
                            String type,
                            String keywords,
                            OrderBy orderBy,
                            Integer limit,
                            String department) {
        this.page = page;
        this.type = (Objects.isNull(type)) ? "" : type;
        this.keywords = Utils.toArray(keywords, ",");
        this.orderBy = (Objects.isNull(orderBy)) ? OrderBy.RECENT : orderBy;
        this.limit = limit;
        this.department = (Objects.isNull(department)) ? "" : department;

    }

    private final Integer page;
    private final String type;
    private final List<String> keywords;
    private final OrderBy orderBy;
    private final Integer limit;
    private final String department;
}
