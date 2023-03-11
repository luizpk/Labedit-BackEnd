import { CommentModel } from "../types"



export interface GetCommentInputDTO {
    idToSearch: string,
    token: string | undefined
}

export type GetCommentOutputDTO = CommentModel[]

export interface CreateCommentInputDTO {
    post_id: string,
    token: string | undefined,
    comments: unknown
}

export interface CreateCommentOutputDTO {
    message: string,
    comment: string
}

export interface EditCommentInputDTO {
    idToEdit: string,
    token: string | undefined,
    comments: unknown
}

export interface DeleteCommentInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface LikeDislikeCommentInputDTO {
    idToLikeDislike: string,
    token: string | undefined,
    like: unknown
}