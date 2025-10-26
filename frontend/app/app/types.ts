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
    projects:Project[];
    createdAt:Date;
    updatedAt:Date;
};

// Removed duplicate ProjectStatus enum
export interface ProjectMember {
    user: User;
    role: "manager" | "contributor" | "viewer";
}

export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
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
    tasks?: Task[]; 
    members?: {
        user:User;
        role:'admin'|'member'|'owner'|'viewer';
    };
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy?: User | string;
    isArchieved?: boolean;
}
export interface Members {
    _id:string;
    user: User; 
    role: "owner" | "member" | "viewer" | "admin";
    joinedAt: Date;
}
export type TaskStatus = "To Do" | "In Progress" | "Done";


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
export enum ProjectMemberRole {
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer",
}
