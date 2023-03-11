import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO, SignupInputDTO, UserDTO, EditUserOutputDTO, DeleteUserOutputDTO, EditUserInputDTO, DeleteUserInputDTO } from "../dtos/UserDTO";
import { BaseError } from "../errors/BaseError";

export class UserController {
    constructor(
        private userDTO: UserDTO,
        private userBusiness: UserBusiness
    ) { }


    public signupUser = async (req: Request, res: Response) => {
        try {
            const input: SignupInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }

            const outPut = await this.userBusiness.signupUser(input)

            res.status(201).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public loginUser = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password,
            }

            const outPut = await this.userBusiness.loginUser(input)

            res.status(201).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public editUser =async (req:Request, res:Response) => {
        try {
            const input= this.userDTO.EditUserInputDTO(
                req.query.id,
                req.body.email,
                req.body.password,
                req.body.role,
                req.headers.authorization
            )
                
            const output: EditUserOutputDTO = await this.userBusiness.editUser(input)
            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            } 
        }
    }

    public deleteUser =async (req:Request, res:Response) => {
        try {
            const input = this.userDTO.DeleteUserInputDTO(
                req.params.id,
                req.headers.authorization
            )
            const output = await this.userBusiness.deleteUser(input)
            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            } 
        }
    }
}

