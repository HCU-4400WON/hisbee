package com.hcu.hot6.domain.request;

import com.hcu.hot6.util.Utils;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

import static com.hcu.hot6.util.Utils.nonEmptyOrElse;
import static com.hcu.hot6.util.Utils.toArray;

@Getter
@NoArgsConstructor
public class TagForm {

    public TagForm(List<String> tags) {
        this.first = toArray(tags.get(0), ",");
        this.second = toArray(tags.get(1), ",");
    }

    private List<String> first;
    private List<String> second;

    public String combine() {
        String first = nonEmptyOrElse(
                Utils.toString(this.first, ","),
                "?");
        String second = nonEmptyOrElse(
                Utils.toString(this.second, ","),
                "?");

        return Utils.toString(List.of(first, second), ";");
    }
}
