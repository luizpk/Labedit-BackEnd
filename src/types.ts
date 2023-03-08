export enum Role {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL"
}

export interface UserTemplate {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    created_at: string,
    updated_at: string
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    created_at: string,
    updated_at:string

}

export interface EditUserDB{
    email:string, 
    password:string,
    role:Role, 
}

export interface TokenPayload {
    id: string,
    name: string,
    role: Role
}

export interface UserOutput{ 
    id:string,
    name:string,
    email:string,
    role:Role,
    created_at:string,
    updated_at:string

}

