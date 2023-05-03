package com.hcu.hot6.domain.converter;

import com.hcu.hot6.domain.enums.Year;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class YearConverter implements Converter<String, Year> {

    @Override
    public Year convert(String source) {
        return Arrays.stream(Year.values())
                .filter(year -> source.equals(year.toKor()))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
