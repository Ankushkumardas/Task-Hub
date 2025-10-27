import Activity from "../models/activity.js";
export const recordActivity=async({userid,action,resourceType,details,resourceid})=>{
    try  {
    await Activity.create({
        user:userid,
        action,
        resourceType,
        details,
        resourceid
    });
} catch (error) {
    console.error("Error recording activity:", error);
}
};
