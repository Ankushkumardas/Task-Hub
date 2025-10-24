import type { ProjectStatus } from "~/types"

export const publicRoutes=[
	"/signup",
	"/login",
	"/verify-email",
	"/reset-password",
	"/forgot-password",
	"/auth/forgot-password",
	"/auth/reset-password",
	"/"
]

export const getTaskStatusColor=(status:ProjectStatus)=>{
	switch(status){
		case "Planning":
			return "bg-blue-500/80";
		case "In Progress":
			return "bg-yellow-500/80";
		case "Completed":
			return "bg-green-500/80";
		case "On Hold":
			return "bg-red-500/80";
		case "Cancelled":
			return "bg-gray-500/80";
		default:
			return "bg-gray-500/80";
	}
};