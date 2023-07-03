package com.hcu.hot6.domain.request;

import com.hcu.hot6.domain.enums.Major;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MemberRequest {

    @NotNull private String nickname;

    @NotNull private Major major1;

    // optional
    private Major major2;
}
