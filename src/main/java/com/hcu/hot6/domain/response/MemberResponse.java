package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberResponse {

    @Builder
    public MemberResponse(String nickname, Boolean isPublic, Boolean isRegistered) {
        this.nickname = nickname;
        this.isPublic = isPublic;
        this.isRegistered = isRegistered;
    }

    public MemberResponse(Member member) {
        this.nickname = member.getNickname();
        this.isPublic = member.isPublic();
        this.isRegistered = member.isRegistered();
    }

    private final String nickname;
    private final Boolean isPublic;
    private final Boolean isRegistered;
}
