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
@DiscriminatorValue("M")
public class Mentoring extends Post {

    private int maxMentor;
    private int maxMentee;

    private int currMentor;
    private int currMentee;

    private boolean hasPay;

    public Mentoring(PostCreationRequest request, Member author) {
        super(request, author, request.getMaxMentor() + request.getMaxMentee());
        this.maxMentor = request.getMaxMentor();
        this.maxMentee = request.getMaxMentee();
        this.hasPay = request.isHasPay();
    }

    public void updateMentoring(PostUpdateRequest request) {
        this.maxMentor = request.getMaxMentor();
        this.maxMentee = request.getMaxMentee();

        this.currMentor = request.getCurrMentor();
        this.currMentee = request.getCurrMentee();

        this.hasPay = request.isHasPay();
        super.updatePost(request, (maxMentor + maxMentee), (currMentor + currMentee));
    }
}
