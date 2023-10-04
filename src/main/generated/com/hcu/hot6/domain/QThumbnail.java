package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QThumbnail is a Querydsl query type for Thumbnail
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QThumbnail extends EntityPathBase<Thumbnail> {

    private static final long serialVersionUID = 2115683238L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QThumbnail thumbnail = new QThumbnail("thumbnail");

    public final StringPath duration = createString("duration");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isClosed = createBoolean("isClosed");

    public final QPost post;

    public final DateTimePath<java.time.LocalDateTime> recruitEnd = createDateTime("recruitEnd", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> recruitStart = createDateTime("recruitStart", java.time.LocalDateTime.class);

    public final StringPath summary = createString("summary");

    public final StringPath tags = createString("tags");

    public final StringPath title = createString("title");

    public QThumbnail(String variable) {
        this(Thumbnail.class, forVariable(variable), INITS);
    }

    public QThumbnail(Path<? extends Thumbnail> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QThumbnail(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QThumbnail(PathMetadata metadata, PathInits inits) {
        this(Thumbnail.class, metadata, inits);
    }

    public QThumbnail(Class<? extends Thumbnail> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.post = inits.isInitialized("post") ? new QPost(forProperty("post"), inits.get("post")) : null;
    }

}

