package com.hcu.hot6.domain.request;

import static com.hcu.hot6.util.Utils.toArray;

import com.hcu.hot6.util.Utils;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TagForm {

    public TagForm(List<String> tags) {
        this.first = toArray(tags.get(0), ",");
        this.second = toArray(tags.get(1), ",");
    }

    private List<String> first = new ArrayList<>();
    private List<String> second = new ArrayList<>();

    public String combine() {
        String first = Objects.requireNonNullElse(Utils.toString(this.first, ","), "?");
        String second = Objects.requireNonNullElse(Utils.toString(this.second, ","), "?");

        return Utils.toString(List.of(first, second), ";");
    }
}
