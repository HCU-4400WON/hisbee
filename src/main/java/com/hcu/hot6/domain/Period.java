package com.hcu.hot6.domain;

import static com.hcu.hot6.util.Utils.toLocalDateTime;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
public class Period {

    @NotNull private LocalDateTime postStart;
    @NotNull private LocalDateTime postEnd;
    @NotNull private LocalDateTime projectStart;

    @CreatedDate private LocalDateTime createdDate;

    @LastModifiedDate private LocalDateTime lastModifiedDate;

    // === 생성 메서드 ===//
    @Builder(builderClassName = "ByPeriodBuilder", builderMethodName = "ByPeriodBuilder")
    public Period(@NotNull Date postStart, @NotNull Date postEnd, @NotNull Date projectStart) {
        this.postStart = toLocalDateTime(postStart);
        this.postEnd = toLocalDateTime(postEnd);
        this.projectStart = toLocalDateTime(projectStart);
    }

    public void update(Date postStart, Date postEnd, Date projectStart) {
        this.postStart = toLocalDateTime(postStart);
        this.postEnd = toLocalDateTime(postEnd);
        this.projectStart = toLocalDateTime(projectStart);
    }
}
