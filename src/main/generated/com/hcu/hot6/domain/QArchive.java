package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QArchive is a Querydsl query type for Archive
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QArchive extends EntityPathBase<Archive> {

    private static final long serialVersionUID = 1111931388L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QArchive archive = new QArchive("archive");

    public final DateTimePath<java.time.LocalDateTime> createdDate = createDateTime("createdDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QMember member;

    public final QPost post;

    public QArchive(String variable) {
        this(Archive.class, forVariable(variable), INITS);
    }

    public QArchive(Path<? extends Archive> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QArchive(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QArchive(PathMetadata metadata, PathInits inits) {
        this(Archive.class, metadata, inits);
    }

    public QArchive(Class<? extends Archive> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
        this.post = inits.isInitialized("post") ? new QPost(forProperty("post"), inits.get("post")) : null;
    }

}

