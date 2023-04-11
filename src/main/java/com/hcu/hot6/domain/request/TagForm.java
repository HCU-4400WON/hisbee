package com.hcu.hot6.domain.request;

import com.hcu.hot6.util.Utils;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TagForm {

    public TagForm(List<String> tags) {
        assert tags.size() == 2;

        this.first = Utils.toArray(tags.get(0), ",");
        this.second = Utils.toArray(tags.get(1), ",");
    }

    private List<String> first;
    private List<String> second;

    public String combine() {
        String first = Utils.toString(this.first, ",");
        String second = Utils.toString(this.second, ",");

        return Utils.toString(List.of(first, second), ";");
    }
}
