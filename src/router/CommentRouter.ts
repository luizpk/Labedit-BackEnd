import express from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentController } from "../controller/commentController"
import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
)

commentRouter.post("/:id", commentController.CreateComment)
commentRouter.put("/:id", commentController.editComment)
commentRouter.delete("/:id", commentController.deleteComment)
commentRouter.get("/:id", commentController.getCommentById)
commentRouter.put("/:id/like", commentController.likeDislike)