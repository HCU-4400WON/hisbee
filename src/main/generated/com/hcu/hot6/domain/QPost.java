package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPost is a Querydsl query type for Post
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPost extends EntityPathBase<Post> {

    private static final long serialVersionUID = -918169178L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPost post = new QPost("post");

    public final QArchive archive;

    public final QMember author;

    public final StringPath contact = createString("contact");

    public final StringPath contactDetails = createString("contactDetails");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createdDate = createDateTime("createdDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isAutoClose = createBoolean("isAutoClose");

    public final BooleanPath isETC = createBoolean("isETC");

    public final StringPath keywords = createString("keywords");

    public final DateTimePath<java.time.LocalDateTime> lastModifiedDate = createDateTime("lastModifiedDate", java.time.LocalDateTime.class);

    public final ListPath<Likes, QLikes> likes = this.<Likes, QLikes>createList("likes", Likes.class, QLikes.class, PathInits.DIRECT2);

    public final ListPath<Poster, QPoster> posters = this.<Poster, QPoster>createList("posters", Poster.class, QPoster.class, PathInits.DIRECT2);

    public final ListPath<PostKeyword, QPostKeyword> postKeywords = this.<PostKeyword, QPostKeyword>createList("postKeywords", PostKeyword.class, QPostKeyword.class, PathInits.DIRECT2);

    public final StringPath postTypes = createString("postTypes");

    public final StringPath qualifications = createString("qualifications");

    public final StringPath targetCount = createString("targetCount");

    public final StringPath targetDepartment = createString("targetDepartment");

    public final StringPath targetYears = createString("targetYears");

    public final QThumbnail thumbnail;

    public final NumberPath<Long> views = createNumber("views", Long.class);

    public QPost(String variable) {
        this(Post.class, forVariable(variable), INITS);
    }

    public QPost(Path<? extends Post> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPost(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPost(PathMetadata metadata, PathInits inits) {
        this(Post.class, metadata, inits);
    }

    public QPost(Class<? extends Post> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.archive = inits.isInitialized("archive") ? new QArchive(forProperty("archive"), inits.get("archive")) : null;
        this.author = inits.isInitialized("author") ? new QMember(forProperty("author")) : null;
        this.thumbnail = inits.isInitialized("thumbnail") ? new QThumbnail(forProperty("thumbnail"), inits.get("thumbnail")) : null;
    }

}

