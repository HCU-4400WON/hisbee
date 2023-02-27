package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("P")
public class Project extends Post {

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;

    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;

    private boolean hasPay;

    public Project(PostCreationRequest request, Member author) {
        super(request, author,
                request.getMaxPlanner()
                        + request.getMaxDeveloper()
                        + request.getMaxDesigner());

        this.maxDeveloper = request.getMaxDeveloper();
        this.maxPlanner = request.getMaxPlanner();
        this.maxDesigner = request.getMaxDesigner();
        this.hasPay = request.isHasPay();
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
