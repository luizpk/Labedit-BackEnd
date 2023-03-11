import { CommentWithCreatorDB, LikeDislikeDB, PostDB, PostWithCreatorDB, POST_LIKE, } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { CommentDatabase } from "./CommentDatabase"


export class PostDatabase extends BaseDatabase {

    public static TABLE_POST = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_Name"
            )
            .join("users", "posts.creator_id", "=", "users.id")

        return result
    }

        

    public async findPostById(idParams: string): Promise<PostDB | undefined> {
        const result: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select()
            .where({ id: idParams })

        return result[0]
    }

    public getPostsWithComments = async (): Promise<PostWithCreatorDB[]> => {
        const resultPost: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_Name"
            )
            .join("users", "posts.creator_id", "=", "users.id")

            const resultComment: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                "comment.id",
                "comment.post_id",
                "comment.user_id",
                "comment.comments",
                "comment.likes",
                "comment.dislikes",
                "comment.created_at",
                "users.name AS creator_Name"
            )
            .join("users", "comment.user_id", "=", "users.id")

            const result = {
                ...resultPost,
                comments: resultComment
            }

        return result
    }

    public async insertPost(newPostDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .insert(newPostDB)
    }

    public async updatePost(newPostDB: PostDB, id: string): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .update(newPostDB)
            .where({ id })
    }

    public async deletePost(id: string): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .delete()
            .where({ id })
    }

    public findPostWithCreatorById = async (
        postId: string
    ): Promise<PostWithCreatorDB | undefined> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "users.name AS creator_Name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", postId)

        return result[0]
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {
        const [likeDislikeDB]: LikeDislikeDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                post_id: likeDislikeDBToFind.post_id,
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? POST_LIKE.LIKED
                : POST_LIKE.DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeDB) => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

}