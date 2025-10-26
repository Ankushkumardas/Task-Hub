import React from "react";
import { Link } from "react-router";
import type { Project } from "~/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getTaskStatusColor } from "~/lib";
import { Progress } from "../ui/progress";
import { format } from "date-and-time";
import { Calendar } from "lucide-react";
interface ProjectCardProps {
  project: Project;
  workspaceid: string;
  projectprogress: number | null;
  // Add other props if needed
}

type Props = ProjectCardProps;
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  workspaceid,
  projectprogress,
}) => {

  return (
    <div className="">
      <Link to={`/workspaces/${workspaceid}/projects/${project._id}`}>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className=" flex items-center justify-between">
                {project.title.charAt(0).toUpperCase()}
                {project.title.slice(1)}
                <span
                  className={` px-2 py-1 rounded-xl  text-xs ${getTaskStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  <span>Progress {projectprogress}%</span>
                </div>
               <Progress
        value={projectprogress}
        className="[&>div]:bg-green-500 bg-slate-200"
      />
              </div>
              <div className=" flex items-center justify-between mt-2">
                <div>
                  <span>{project.tasks?.length}</span>
                  <span>Tasks</span>
                </div>
                <div className="">
                  {project.dueDate && (
                    <div className=" flex items-center justify-center">
                      <Calendar size={16} />{" "}
                      <span>
                        {project.dueDate
                          ? format(new Date(project.dueDate), "DD/MM/YYYY")
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ProjectCard;
