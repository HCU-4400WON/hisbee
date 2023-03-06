package com.hcu.hot6.domain.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Getter
public class MemberPoolResponse {

    private final long total;
    private final List<MemberProfileResponse> members;
}
