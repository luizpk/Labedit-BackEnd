import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostController } from "../controller/postController"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
)
)

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.CreatePost)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeDislike)