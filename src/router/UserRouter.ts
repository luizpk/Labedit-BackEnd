import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/userController"
import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dtos/UserDTO"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const userRouter = express.Router()

const userDTO = new UserDTO()

const userController = new UserController(
    userDTO,
    new UserBusiness(
        
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager(),
        new UserDTO,
    )
)

userRouter.put('/:id', userController.editUser)
userRouter.delete('/:id', userController.deleteUser)
userRouter.post('/signup', userController.signupUser)
userRouter.post('/login', userController.loginUser)