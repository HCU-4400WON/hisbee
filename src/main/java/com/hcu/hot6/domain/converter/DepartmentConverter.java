package com.hcu.hot6.domain.converter;

import com.hcu.hot6.domain.Department;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class DepartmentConverter implements Converter<String, Department> {

    @Override
    public Department convert(String source) {
        for (Department department : Department.values()) {
            if (department.getName().equals(source)) {
                return department;
            }
        }
        throw new IllegalArgumentException("No match found: source = " + source);
    }
}
