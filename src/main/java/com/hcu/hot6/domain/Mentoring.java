package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;

@Entity
@Getter
@DiscriminatorValue("M")
public class Mentoring extends Post{

    private int maxMentor;
    private int maxMentee;

    private int currMentor;
    private int currMentee;

    private boolean hasPay;
}
