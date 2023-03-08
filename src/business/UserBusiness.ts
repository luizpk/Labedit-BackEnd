import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { SignupInputDTO, DeleteUserInputDTO,  DeleteUserOutputDTO,  EditUserInputDTO,  EditUserOutputDTO,  LoginInputDTO, LoginOutputDTO, UserDTO, GetUsersInputDTO, GetUsersOutputDTO  } from "../dtos/UserDTO"
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { Role, TokenPayload} from "../types";
import { User } from "../models/UserModel";
import { UserDatabase } from "../database/UserDatabase";

export const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
export const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager,
        private userDTO: UserDTO
    ) { }

    public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const usersDB = await this.userDatabase.getAllUsers()

        const users = usersDB.map((userDB) => {
            const user = new User (
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at,
                userDB.updated_at
                

            )
            return user.toBusinessModel()
        })

        const output: GetUsersOutputDTO = users

        return output
    }


    public signupUser = async (input: SignupInputDTO) => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new BadRequestError("'Name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!email.match(regexEmail)) {
            throw new BadRequestError("'email' deve possuir letras maiúsculas, deve ter um @, letras minúsculas, ponto (.) e de 2 a 4 letras minúsculas")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        if (!password.match(regexPassword)) {
            throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
        }

        const id = this.idGenerator.generate()

        const passwordHash = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            passwordHash,
            Role.NORMAL,
            new Date().toISOString(),
            new Date().toISOString(),
            
        )

        const newUserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt(),
            updated_at: newUser.getCreatedAt()

        }

        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output = {
            token: token
        }

        return output
    }

    public loginUser = async (input: LoginInputDTO) => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado");
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at,
            userDB.updated_at
        )

        const passwordHash = await this.hashManager.compare(password, userDB.password)

        if (!passwordHash) {
            throw new BadRequestError("'password' incorreto")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output = {
            token: token
        }

        return output
    }

    public editUser = async (input:EditUserInputDTO):Promise<EditUserOutputDTO>=>{
        const {id,email, password,role,token} = input

        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("Token invalido")
        }
        if(id){

            if(payload.role !== Role.ADMIN){
                if(payload.id!==id){
                    throw new BadRequestError("Usuarios 'NORMAL' so pode editar a si mesmo")
                }
            }
        }

        if(role && payload.role !== Role.ADMIN){
            throw new BadRequestError("Usuario precisa ser ADMIN para trocar o role de um usuario")
        }
        if(password!==undefined){
            if(!password.match(regexPassword)){
                throw new BadRequestError("Password teve conter pelo menos 1 letra Maiuscula, 1 letra minuscula, 1 caracter especial, 1 numero e ter de 8 a 12 caracteres");
            }
            if(payload.id!==id){
                throw new BadRequestError("Apenas o proprio usuario pode editar seu password")
            }
        }
        const userDB = await this.userDatabase.getUserById(id||payload.id)
        console.log(userDB)

        if(userDB === undefined){
            throw new NotFoundError("usuario não encontrado")
        }
        const userEdit = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at,
            userDB.updated_at
        )
        if(password){
            const hashedPassword = await this.hashManager.hash(password)
            userEdit.setPassword(hashedPassword)
            
        }
        if(role){
            userEdit.setRole(role)
            

        }
        if(email){
            userEdit.setEmail(email)
            

        }
        const userToEditDB = userEdit.ToEditDB()

        await this.userDatabase.editUser(userEdit.getId(),userToEditDB)

        const output = this.userDTO.EditUserOutputDTO(userEdit)

        return output

    }

    public deleteUser = async (input:DeleteUserInputDTO):Promise<DeleteUserOutputDTO> => {
        const {id, token} = input
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("Token invalido")
        }
        if(id){
            if(payload.role!==Role.ADMIN){
                if(payload.id!==id){
                    throw new BadRequestError("Um usuario 'NORMAL' pode deletar somente si mesmo")
                }
            }
        }
        await this.userDatabase.deleteUser(id||payload.id)

        return this.userDTO.DeleteUserOutputDTO("Usuario deletado com sucesso")
    }
}

