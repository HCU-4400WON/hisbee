package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;

@Entity
@Getter
@DiscriminatorValue("P")
public class Project extends Post{

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;

    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;

    private boolean hasPay;

}
