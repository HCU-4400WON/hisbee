package com.hcu.hot6.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.hcu.hot6.domain.Department;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
@Getter
public enum Major {

    NONE(Department.NONE, "해당없음"),

    GLS(Department.GLS, "글로벌리더십학부"),

    GE(Department.SIT, "GE"),
    ICT(Department.SIT, "ICT융합"),
    ACE(Department.SIT, "ACE"),

    IAS(Department.ISE, "국제지역학"),
    ENG(Department.ISE, "영어"),

    MGMT(Department.MEC, "경영학"),
    ECON(Department.MEC, "경제학"),
    GM(Department.MEC, "GM"),

    KOL(Department.LAW, "한국법"),
    UIL(Department.LAW, "UIL"),

    CP(Department.CSW, "상담심리학"),
    SW(Department.CSW, "사회복지학"),

    VPA(Department.CCC, "공연영상학"),
    MC(Department.CCC, "언론정보학"),

    CE(Department.CUE, "건설공학"),
    UEE(Department.CUE, "도시환경공학"),

    LS(Department.BFT, "생명과학부"),

    ME(Department.HMM, "기계공학"),
    ECE(Department.HMM, "전자제어공학"),

    CS(Department.ECE, "컴퓨터공학"),
    EE(Department.ECE, "전자공학"),

    VCD(Department.IID, "시각디자인"),
    PD(Department.IID, "제품디자인");

    private final Department department;
    private final String name;

    @JsonCreator
    public static Major from(String code) {
        return Arrays.stream(Major.values())
                .filter(major -> code.equals(major.name))
                .findFirst()
                .orElseThrow();
    }

    @JsonValue
    public String toKor() {
        return name;
    }
}
