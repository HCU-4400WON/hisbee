package com.hcu.hot6.domain.response;

import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class MemberPoolResponse {

    private final long total;
    private final List<MemberProfileResponse> members;
}
