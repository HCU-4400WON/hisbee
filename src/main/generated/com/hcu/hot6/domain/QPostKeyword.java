package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPostKeyword is a Querydsl query type for PostKeyword
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPostKeyword extends EntityPathBase<PostKeyword> {

    private static final long serialVersionUID = -1663773341L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPostKeyword postKeyword = new QPostKeyword("postKeyword");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QKeyword keyword;

    public final QPost post;

    public QPostKeyword(String variable) {
        this(PostKeyword.class, forVariable(variable), INITS);
    }

    public QPostKeyword(Path<? extends PostKeyword> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPostKeyword(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPostKeyword(PathMetadata metadata, PathInits inits) {
        this(PostKeyword.class, metadata, inits);
    }

    public QPostKeyword(Class<? extends PostKeyword> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.keyword = inits.isInitialized("keyword") ? new QKeyword(forProperty("keyword")) : null;
        this.post = inits.isInitialized("post") ? new QPost(forProperty("post"), inits.get("post")) : null;
    }

}

