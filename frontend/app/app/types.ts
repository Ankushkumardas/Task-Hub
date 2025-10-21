export interface User{
    _id:string;
    name:string;
    email:string;
    createdAt:Date;
    isemailverified?:boolean;
    updatedAt?:Date;
    profilepicture?:string;
};

export interface Workspace{
    _id:string;
    name:string;
    description?:string;
    owner?:User|string;
    color:string;
    members:{
        user:User;
        role:"admin"|"member"|"owner"|"viewer";
        joinedDate:Date;
    }[];
    createdAt:Date;
    updatedAt:Date;
}