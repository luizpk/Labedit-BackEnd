import { EditUserDB, Role, UserDB, UserOutput, UserTemplate } from "../types"

export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: Role,
        private created_at: string,
        private updated_at: string
    ) { }

    public getId(): string {
        return this.id
    }

    
    public getName(): string {
        return this.name
    }

    public setName(value: string): void {
        this.name = value
    }

    public getEmail(): string {
        return this.email
    }

    public setEmail(value: string): void {
        this.email = value
    }

    public getPassword(): string {
        return this.password
    }

    public setPassword(value: string): void {
        this.password = value
    }

    public getRole(): Role {
        return this.role
    }

    public setRole(value: Role): void {
        this.role = value
    }

    public getCreatedAt(): string {
        return this.created_at
    }

    public setCreatedAt(value: string): void {
        this.created_at = value
    }

    public toDatabaseModel(): UserDB {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

    public getUsersOutput():UserOutput{
        return {
        id:this.id,
        name:this.name,
        email:this.email,
        role:this.role,
        created_at:this.created_at,
        updated_at:this.updated_at
    }
}

    public toBusinessModel(): UserTemplate {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

    public ToEditDB():EditUserDB{
        return{
           email:this.email,
           password:this.password,
           role:this.role,
           updated_at:this.updated_at 
                  
        }
       }

}

