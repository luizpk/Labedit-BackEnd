import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/UserModel";
import { Role, UserTemplate } from "../types";

export interface SignupInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupOutputDTO {
    message: string,
    user: {
        id: string,
        name: string,
        email: string,
        role: Role,
        created_at: string,
        updated_at: string

    },
    token: string
}

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    message: string,
    user: {
        id: string,
        name: string
    },
    token: string
}

export interface EditUserInputDTO{
    id?:string
    email?:string,
    password?:string,
    role?:Role,
    token:string
}

export interface EditUserOutputDTO{
    message:string,
    user: {
        id: string,
        name: string,
        email: string,
        role: Role,
        created_at: string,
        updated_at: string

    }

}
export interface DeleteUserInputDTO{
    id?:string,
    token:string
}
export interface DeleteUserOutputDTO{
    message:string
}

export class UserDTO {
    constructor() { }

    public SignupInputDTO = (
        name: unknown,
        email: unknown,
        password: unknown
    ): SignupInputDTO => {
        if (typeof name !== 'string') {
            throw new BadRequestError("'name' deve ser uma string");
        }
        if (typeof email !== 'string') {
            throw new BadRequestError("'email' deve ser uma string");
        }
        if (typeof password !== 'string') {
            throw new BadRequestError("'password' deve ser uma string");
        }
        const dto: SignupInputDTO = {
            name,
            email,
            password
        }
        return dto
    }

    public SignupOutputDTO = (user: User, token: string): SignupOutputDTO => {
        const dto: SignupOutputDTO = {
            message: "Usuario adicionado com sucesso",
            user: user.getUsersOutput(),
            token
        }
        return dto
    }

    public LoginInputDTO = (
        email: unknown,
        password: unknown
    ): LoginInputDTO => {
        if (typeof email !== 'string') {
            throw new BadRequestError("email deve ser uma string");

        }
        if (typeof password !== 'string') {
            throw new BadRequestError("Password deve ser uma string");

        }
        const dto: LoginInputDTO = {
            email,
            password
        }
        return dto
    }

    public LoginOutputDTO = (user: User, token: string): LoginOutputDTO => {
        const dto: LoginOutputDTO = {
            message: "Login feito com sucesso",
            user: {
                id: user.getId(),
                name: user.getName(),
            },
            token
        }
        return dto
    }

    

    public EditUserInputDTO = (
        id:unknown,
        email:unknown,
        password: unknown,
        role: unknown,
        token: unknown
    ):EditUserInputDTO => {

        if (id !== undefined) {
            if (typeof id !== 'string') {
                throw new BadRequestError("'id' deve ser um string")
            }
        }
        if (email !== undefined) {
            if (typeof email !== 'string') {
                throw new BadRequestError("'email' deve ser um string")
            }
        }
        if (password !== undefined) {
            if (typeof password !== 'string') {
                throw new BadRequestError("'password' deve ser um string")
            }
        }
        if (role !== undefined) {
            if (role !== Role.ADMIN && role !== Role.NORMAL) {
                throw new BadRequestError("'password' deve ser um string")
            }
        }
        if (typeof token !== 'string') {
            throw new BadRequestError("'password' deve ser um string")
        }
        const dto = {
            id,
            password,
            email,
            role,
            token
        }
        return dto
    }

    public EditUserOutputDTO = (user:User):EditUserOutputDTO=>{
        const dto = {
            message: "Usuario editado com sucesso",
            user: user.getUsersOutput(),

        }
        return dto
    }

    public DeleteUserInputDTO = (
        id:string,
        token:string
    ):DeleteUserInputDTO=>{
        if(id!==undefined){
            if(typeof id !== 'string'){
                throw new BadRequestError("'id' deve ser uma string ou undifenied")
            }
        }

        if(typeof token !== 'string'){
            throw new BadRequestError("Token deve estar preenchido")
        }
        const dto = {
            id,
            token
        }
        return dto
    }

    public DeleteUserOutputDTO = (message:string):DeleteUserOutputDTO=>{
        return{
            message
        }
    }


}

export interface GetUsersInputDTO {
    token: string | undefined
}

export type GetUsersOutputDTO = UserTemplate[]

export interface EditUserInputDTO{
    id?:string
    email?:string,
    password?:string,
    role?:Role,
    token:string
}

export interface EditUserOutputDTO{
    message:string,
    user: {
        id: string,
        name: string,
        email: string,
        role: Role,
        created_at: string,
        updated_at: string

    }

}

export interface DeleteUserInputDTO{
    id?:string,
    token:string
}

export interface DeleteUserOutputDTO{
    message:string
}