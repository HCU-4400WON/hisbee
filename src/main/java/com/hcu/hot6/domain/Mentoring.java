package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.jetbrains.annotations.NotNull;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorValue("M")
public class Mentoring extends Post {

    @NotNull
    private int maxMentor;
    @NotNull
    private int maxMentee;

    private int currMentor = 0;
    private int currMentee = 0;

    @NotNull
    private boolean hasPay;

    public Mentoring(PostCreationRequest request, Member author) {
        super(request, author, request.getMaxMentor() + request.getMaxMentee());
        this.maxMentor = request.getMaxMentor();
        this.maxMentee = request.getMaxMentee();
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
