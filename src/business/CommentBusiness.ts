import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CreateCommentInputDTO, DeleteCommentInputDTO, EditCommentInputDTO, GetCommentInputDTO, LikeDislikeCommentInputDTO } from "../dtos/CommentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Comment } from "../models/CommentModel"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { COMMENT_LIKE, Role, LikeDislikeCommentDB, CommentModel } from "../types"



export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }


    public getCommentById = async (input: GetCommentInputDTO): Promise<CommentModel> => {

        const { idToSearch, token } = input

        if (token === undefined) {
            throw new BadRequestError("Comment necessita de um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsDB = await this.commentDatabase.findCommentById(idToSearch)

        if (!commentsDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const comment = new Comment(
            commentsDB.id,
            commentsDB.post_id,
            commentsDB.user_id,
            commentsDB.comments,
            commentsDB.likes,
            commentsDB.dislikes,
            commentsDB.created_at,
        ).toBusinessModel()

        return comment
    }



    public createComment = async (input: CreateCommentInputDTO): Promise<void> => {
        const { post_id, comments, token } = input
        console.log(input);

        if (token === undefined) {
            throw new BadRequestError("Comment necessita de um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        

        const postDBExists = await this.postDatabase.findPostById(post_id)

        if (postDBExists === null) {
            throw new NotFoundError("'id' não encontrada")
        }

        if (typeof comments !== "string") {
            throw new BadRequestError("'comments' deve ser uma string")
        }

        const newId = this.idGenerator.generate()

        const newComment = new Comment(
            newId,
            post_id,
            payload.id,
            comments,
            0,
            0,
            new Date().toISOString(),
        )

        const newCommentDB = newComment.toDBModel()

        await this.commentDatabase.insertComment(newCommentDB)
    }



    public editComment = async (input: EditCommentInputDTO): Promise<void> => {
        const { idToEdit, token, comments } = input

        if (token === undefined) {
            throw new BadRequestError("Comment necessita de um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token inválido");
        }

        if (typeof comments !== "string") {
            throw new BadRequestError("'comments' deve ser uma string")
        }

        const newCommentDB = await this.commentDatabase.findCommentById(idToEdit)

        if (!newCommentDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = payload.id

        if (newCommentDB.user_id !== creatorId) {
            throw new BadRequestError("somente o criador do Comment pode editá-lo")
        }

        const comment = new Comment(
            newCommentDB.id,
            newCommentDB.post_id,
            newCommentDB.user_id,
            newCommentDB.comments,
            newCommentDB.likes,
            newCommentDB.dislikes,
            newCommentDB.created_at,
        )

        comment.setComments(comments)

        const updatedCommentDB = comment.toDBModel()

        await this.commentDatabase.updateComment(updatedCommentDB, idToEdit)

    }



    public deleteComment = async (input: DeleteCommentInputDTO): Promise<void> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("Comment necessita de um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Usuário precisa fazer login")
        }

        const commentDBExists = await this.commentDatabase.findCommentById(idToDelete)

        if (!commentDBExists) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = payload.id

        if (payload.role !== Role.ADMIN && commentDBExists.user_id !== creatorId) {
            throw new BadRequestError("somenste o criador do Comment pode deleta-lo");
        }


        await this.commentDatabase.deleteComment(idToDelete)

    }



    public likeOrDislikeComment = async (input: LikeDislikeCommentInputDTO): Promise<void> => {
        const { idToLikeDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("Comment necessita de um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentWithCreatorById(idToLikeDislike)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeCommentDB = {
            comment_id: commentWithCreatorDB.id,
            post_id: commentWithCreatorDB.post_id,
            user_id: userId,
            like: likeSQLite
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.user_id,
            commentWithCreatorDB.post_id,
            commentWithCreatorDB.comments,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at
        )

        const likeDislikeExists = await this.commentDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === COMMENT_LIKE.LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }

        } else if (likeDislikeExists === COMMENT_LIKE.DISLIKED) {
            if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }

        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeDB)

            like ? comment.addLike() : comment.addDislike()
        }

        const updatedCommentDB = comment.toDBModel()

        await this.commentDatabase.updateComment(updatedCommentDB, idToLikeDislike)
    }
}