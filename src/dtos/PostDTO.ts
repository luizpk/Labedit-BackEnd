import { PostModel } from "../types"

export interface GetPostsInputDTO {
    user?:string,
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined,
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}