import { PostDB, PostWithCreatorDB, } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { CommentDatabase } from "./CommentDatabase";

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
                "users.nick_name AS creator_nickName"
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
                "users.nick_name AS creator_nickName"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", postId)

        return result[0]
    }

}