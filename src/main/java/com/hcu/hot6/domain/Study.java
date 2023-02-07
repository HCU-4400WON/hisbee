package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;

@Entity
@Getter
@DiscriminatorValue("S")
public class Study extends Post{

    private int maxMember;
    private int currMember;

}
