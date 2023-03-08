import { EditUserDB, UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public getAllUsers = async (): Promise<UserDB[]> => {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
        return result
    }

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ email })

        return result[0]
    }

    public async insertUser(userDB: UserDB): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(userDB)
    }
   
    public getUserById = async (id: string): Promise<UserDB | undefined> => {
        const [user] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id })
        return user
    }

    public editUser = async (id: string, user: EditUserDB): Promise<void> => {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .update(user)
            .where({ id })
    }

    public deleteUser =async (id:string) => {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .del()
        .where({ id })
    }
        
}

