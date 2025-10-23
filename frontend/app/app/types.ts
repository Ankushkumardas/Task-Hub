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
        joinedAt:Date;
    }[];
    createdAt:Date;
    updatedAt:Date;
};

export enum ProjectStatus {
    Planning = "Planning",
    InProgress = "In Progress",
    OnHold = "On Hold",
    Completed = "Completed",
    Cancelled = "Cancelled"
}
export interface ProjectMember {
    user: User;
    role: "manager" | "contributor" | "viewer";
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    workspace: Workspace | string;
    status: ProjectStatus;
    startDate?: Date;
    dueDate?: Date;
    progress?: number;
    tasks?: Task[]; // Array of Task IDs
    members?: ProjectMember[];
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy?: User | string;
    isArchieved?: boolean;
}

export enum TaskStatus {
    ToDo = "To Do",
    InProgress = "In Progress",
    Done = "Done",
    Review = "Review"
}

export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Critical = "Critical"
}

export interface TaskSubtask {
    title: string;
    completed?: boolean;
    createdAt?: Date;
    _id:string;
}

export interface TaskAttachment {
    filename: string;
    fileurl: string;
    filetype: string;
    filesize: number;
    uploadedBy?: User | string;
    uploadedAt?: Date;
    _id:string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    assignees?: User[] | string[];
    project?: Project | string;
    completedAt?: Date;
    estimatedHours?: number;
    actualHours?: number;
    tags?: string[];
    subtasks?: TaskSubtask[];
    comments?: string[];
    attachments?: TaskAttachment[];
    createdBy?: User | string;
    isArchieved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}