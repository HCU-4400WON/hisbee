package com.hcu.hot6.domain.filter;

import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.enums.PostType;
import com.hcu.hot6.domain.enums.PostTypeDetails;
import lombok.Builder;
import lombok.Getter;

import java.util.Objects;

@Getter
public class PostSearchFilter {

    @Builder
    public PostSearchFilter(Integer page,
                            String search,
                            OrderBy orderBy,
                            PostType type,
                            PostTypeDetails typeDetails,
                            Boolean hasPay,
                            Integer limit) {
        this.page = page;
        this.search = search;
        this.orderBy = (Objects.isNull(orderBy)) ? OrderBy.RECENT : orderBy;
        this.type = type;
        this.typeDetails = typeDetails;
        this.hasPay = hasPay;
        this.limit = limit;
    }

    private final Integer page;
    private final String search;

    private final OrderBy orderBy;
    private final PostType type;
    private final PostTypeDetails typeDetails;
    private final Boolean hasPay;
    private final Integer limit;

    public boolean isNotValid() {
        return (type == null && typeDetails != null) ||
                (type == null && hasPay != null) ||
                (type != null && typeDetails != null
                        && !typeDetails.getType().equals(type));
    }
}
