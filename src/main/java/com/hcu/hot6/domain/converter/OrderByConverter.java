package com.hcu.hot6.domain.converter;

import com.hcu.hot6.domain.enums.OrderBy;
import java.util.Arrays;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class OrderByConverter implements Converter<String, OrderBy> {

    @Override
    public OrderBy convert(String source) {
        return Arrays.stream(OrderBy.values())
                .filter(orderBy -> orderBy.name().equals(source.toUpperCase()))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
