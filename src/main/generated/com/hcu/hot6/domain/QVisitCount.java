package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QVisitCount is a Querydsl query type for VisitCount
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QVisitCount extends EntityPathBase<VisitCount> {

    private static final long serialVersionUID = 991530762L;

    public static final QVisitCount visitCount = new QVisitCount("visitCount");

    public final DateTimePath<java.time.LocalDateTime> createdDate = createDateTime("createdDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> creationTime = createNumber("creationTime", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isNew = createBoolean("isNew");

    public final NumberPath<Long> lastAccessTime = createNumber("lastAccessTime", Long.class);

    public final StringPath sessionId = createString("sessionId");

    public QVisitCount(String variable) {
        super(VisitCount.class, forVariable(variable));
    }

    public QVisitCount(Path<? extends VisitCount> path) {
        super(path.getType(), path.getMetadata());
    }

    public QVisitCount(PathMetadata metadata) {
        super(VisitCount.class, metadata);
    }

}

