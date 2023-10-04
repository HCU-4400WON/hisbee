package com.hcu.hot6.domain;

import jakarta.persistence.*;
import java.sql.Connection;
import java.time.LocalDateTime;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;

@Entity
@Getter
public class VisitCount {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "visit_id", nullable = false)
    private Long id;

    @NotNull private String sessionId;
    @NotNull private long lastAccessTime;
    @NotNull private long creationTime;
    @NotNull private boolean isNew;

    @NotNull private LocalDateTime createdDate;

    public VisitCount(String sessionId, long lastAccessTime, long creationTime, boolean isNew) {
        this.sessionId = sessionId;
        this.lastAccessTime = lastAccessTime;
        this.creationTime = creationTime;
        this.isNew = isNew;
        this.createdDate = LocalDateTime.now();
    }

    public VisitCount() {}

    public void setConnection(Connection conn) {}
}
