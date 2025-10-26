import type { ProjectStatus, TaskStatus } from "~/types"

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
			return "bg-blue-100 text-blue-700 dark:text-blue-300";
		case "In Progress":
			return "bg-yellow-100 text-yellow-700 dark:text-yellow-300";
		case "Completed":
			return "bg-green-100 text-green-700 dark:text-green-300";
		case "On Hold":
			return "bg-red-100 text-red-700 dark:text-red-300";
		case "Cancelled":
			return "bg-gray-100 text-gray-700 dark:text-gray-300";
		default:
			return "bg-gray-100 text-gray-700 dark:text-gray-300";
	}
};

export const getProjectProgress = (tasks: { status: TaskStatus }[]) => {
	const totaltasks=tasks.length;
		const completedTasks = tasks.filter(task => task.status === "Done").length;
	const progress=totaltasks>0? Math.round((completedTasks / tasks.length) * 100):0;
	return progress;
}