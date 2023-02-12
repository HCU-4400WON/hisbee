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
@DiscriminatorValue("S")
public class Study extends Post {

    @NotNull
    private int maxMember;

    private int currMember = 0;

    public Study(PostCreationRequest request, Member author) {
        super(request, author, request.getMaxMember());
        this.maxMember = request.getMaxMember();
    }

    public void updateStudy(PostUpdateRequest request) {
        this.maxMember = request.getMaxMember();
        this.currMember = request.getCurrMember();

        super.updatePost(request, maxMember, currMember);
    }
}
