package com.hcu.hot6.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -1987599840L;

    public static final QMember member = new QMember("member1");

    public final ListPath<Archive, QArchive> archives = this.<Archive, QArchive>createList("archives", Archive.class, QArchive.class, PathInits.DIRECT2);

    public final StringPath email = createString("email");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isRegistered = createBoolean("isRegistered");

    public final ListPath<Likes, QLikes> likes = this.<Likes, QLikes>createList("likes", Likes.class, QLikes.class, PathInits.DIRECT2);

    public final EnumPath<com.hcu.hot6.domain.enums.Major> major1 = createEnum("major1", com.hcu.hot6.domain.enums.Major.class);

    public final EnumPath<com.hcu.hot6.domain.enums.Major> major2 = createEnum("major2", com.hcu.hot6.domain.enums.Major.class);

    public final StringPath nickname = createString("nickname");

    public final StringPath pictureUrl = createString("pictureUrl");

    public final ListPath<Post, QPost> posts = this.<Post, QPost>createList("posts", Post.class, QPost.class, PathInits.DIRECT2);

    public final StringPath uid = createString("uid");

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

