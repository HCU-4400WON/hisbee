package com.hcu.hot6.domain.converter;

import com.hcu.hot6.domain.Position;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class PositionConverter implements Converter<String, Position> {

    @Override
    public Position convert(String source) {
        for (Position position : Position.values()) {
            if (position.getName().equals(source)) {
                return position;
            }
        }
        throw new IllegalArgumentException("No match found: source = " + source);
    }
}
