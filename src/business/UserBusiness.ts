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
            throw new BadRequestError("É necessário um token")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const usersDataBase = await this.userDatabase.getAllUsers()

        const users = usersDataBase.map((userDB) => {
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
            throw new BadRequestError("'Name' deve ser uma string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("Digite um e-mail válido")
        }

        if (!email.match(regexEmail)) {
            throw new BadRequestError("Digite um e-mail válido")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser uma string")
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
            throw new BadRequestError("'email' deve ser uma string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser uma string")
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
            throw new BadRequestError("Token é inválido")
        }
        if(id){

            if(payload.role !== Role.ADMIN){
                if(payload.id!==id){
                    throw new BadRequestError("Você só tem permissão para editar seu próprio cadastro")
                }
            }
        }

        if(role && payload.role !== Role.ADMIN){
            throw new BadRequestError("Somente o ADMIN pode efetuar a troca de perfil")
        }
        if(password!==undefined){
            if(!password.match(regexPassword)){
                throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
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

        const userDBExists = await this.userDatabase.getUserById(id)

        if (!userDBExists) {
            throw new NotFoundError("usuário não encontrado");
        }

        const creatorId = payload.id

        if(id){
            if(payload.role!==Role.ADMIN && userDBExists.id !== creatorId){
                if(payload.id!==id){
                    throw new BadRequestError("Você não tem permissão para deletar outro usuário")
                }
            }
        }
        await this.userDatabase.deleteUser(id||payload.id)

        return this.userDTO.DeleteUserOutputDTO("Usuario deletado com sucesso")
    }
}

