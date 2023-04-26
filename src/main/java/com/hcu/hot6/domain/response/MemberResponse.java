package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberResponse {

    @Builder
    public MemberResponse(String nickname, Boolean isPublic, Boolean isRegistered) {
        this.nickname = nickname;
        this.isRegistered = isRegistered;
    }

    public MemberResponse(Member member) {
        this.nickname = member.getNickname();
        this.isRegistered = member.isRegistered();
    }

    private final String nickname;
    private final Boolean isRegistered;
}
