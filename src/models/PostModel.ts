import { PostDB, PostModel } from "../types"


export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private comments: number,
        private created_at: string,
        private updated_at: string,
        private creator_at: string,
        private creatorName: string,
    ) { }

    

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }



    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }


    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }


    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }


    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }


    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }


    public getComments(): number {
        return this.comments
    }

    public setComments(value: number): void {
        this.comments = value
    }


    public getCreated_at(): string {
        return this.created_at
    }

    public setCreated_at(value: string): void {
        this.created_at = value
    }


    public getUpdated_at(): string {
        return this.updated_at
    }

    public setUpdated_at(value: string): void {
        this.updated_at = value
    }


    public getCreator_at(): string {
        return this.creator_at
    }

    public setCreator_at(value: string): void {
        this.creator_at = value
    }


    public getCreatorName(): string {
        return this.creatorName
    }

    public setCreatorName(value: string): void {
        this.creatorName = value
    }


    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creator_at,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments,
            created_at: this.created_at,
            updated_at: this.updated_at,
            creator: {
                id: this.creator_at,
                name: this.creatorName
            }
        }
    }
}