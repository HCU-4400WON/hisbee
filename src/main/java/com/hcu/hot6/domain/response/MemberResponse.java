package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Member;
import com.hcu.hot6.domain.enums.Major;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberResponse {

    public MemberResponse(Member member) {
        this.nickname = member.getNickname();
        this.major1 = member.getMajor1();
        this.major2 = member.getMajor2();
    }

    private String nickname;
    private Major major1;
    private Major major2;
}
