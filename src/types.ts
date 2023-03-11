export enum Role {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL"
}

export interface UserTemplate {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    created_at: string,
    updated_at: string
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    created_at: string,
    updated_at:string

}

export interface EditUserDB{
    email:string, 
    password:string,
    role:Role, 
}

export interface TokenPayload {
    id: string,
    name: string,
    role: Role
}

export interface UserOutput{ 
    id:string,
    name:string,
    email:string,
    role:Role,
    created_at:string,
    updated_at:string

}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    created_at: string,
    updated_at: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostDB{
    id:string,
    creator_id:string,
    content:string,
    likes:number,
    dislikes:number,
    comments:number,
    created_at:string,
    updated_at:string
}

export interface PostEditDB{
    content?:string,
    likes?:number,
    dislikes?:number,
    comments?:number,
    updated_at?:string
}

export interface PostWithCreatorDB extends PostDB {
    creatorName: string
}


export interface CommentModel {
    id: string,
    post_id: string,
    user_id: string,
    comments: string,
    likes: number,
    dislikes: number,
    created_at: string
}

export interface CommentDB {
    id: string,
    post_id: string,
    user_id: string,
    comments: string,
    likes: number,
    dislikes: number,
    created_at: string
}

export interface CommentWithCreatorDB extends CommentDB {
    creator_name: string
}

export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface LikeDislikeCommentDB {
    post_id: string,
    comment_id: string,
    user_id: string,
    like: number
}

export enum POST_LIKE {
    LIKED = "LIKED",
    DISLIKED = "DISLIKED"
}

export enum COMMENT_LIKE {
    LIKED = "LIKED",
    DISLIKED = "DISLIKED"
}