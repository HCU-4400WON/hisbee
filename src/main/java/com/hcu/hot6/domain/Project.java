package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("P")
public class Project extends Post{

    @NotNull
    private int maxDeveloper;
    @NotNull
    private int maxPlanner;
    @NotNull
    private int maxDesigner;

    @Column(nullable = false)
    private int currDeveloper;
    @Column(nullable = false)
    private int currPlanner;
    @Column(nullable = false)
    private int currDesigner;

    @NotNull
    private boolean hasPay;

    //=== 생성 메서드 ===//
    public Project(String title, String content, String contact, Member author, int maxDeveloper, int maxPlanner, int maxDesigner, boolean hasPay, int total){
        super(title, content, contact, author, (maxDeveloper + maxPlanner + maxDesigner));

        Assert.notNull(maxDeveloper, "프로젝트의 개발자모집인원(maxDeveloper)은 필수 입력사항입니다.");
        Assert.notNull(maxPlanner, "프로젝트의 기획자모집인원(maxPlanner)은 필수 입력사항입니다.");
        Assert.notNull(maxDesigner, "프로젝트의 디자이너모집인원(maxDesigner)은 필수 입력사항입니다.");

        this.maxDeveloper = maxDeveloper;
        this.maxPlanner = maxPlanner;
        this.maxDesigner = maxDesigner;

        this.currDeveloper = 0;
        this.currPlanner = 0;
        this.currDesigner = 0;

        this.hasPay = hasPay;
    }

    public void updateProject(PostUpdateRequest request) {
        this.maxDeveloper = request.getMaxDeveloper();
        this.maxPlanner = request.getMaxPlanner();
        this.maxDesigner = request.getMaxDesigner();

        this.currDeveloper = request.getCurrDeveloper();
        this.currPlanner = request.getCurrPlanner();
        this.currDesigner = request.getCurrDesigner();

        this.hasPay = request.isHasPay();
        super.updatePost(request, (maxDeveloper + maxPlanner + maxDesigner), (currDeveloper + currPlanner + currDesigner));
    }
}
