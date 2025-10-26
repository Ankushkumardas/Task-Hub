import React from "react";
import type { Project } from "~/types";
import NoDataFound from "~/routes/dashboard/workspaces/noDatafound";
import ProjectCard from "../projects/projectCard";
interface ProjectListProps {
  workspaceid: string;
  project: Project[];
  onCreateproject: () => void;
}
const ProjectList: React.FC<ProjectListProps> = ({
  workspaceid,
  project,
  onCreateproject,
}) => {
  return (
    <div>
      <h1>Projects</h1>
      <div>
        {project.length === 0 ? (
          <div className="col-span-full flex items-center justify-center mt-10">
            <NoDataFound
              title={"No Projects are there to be shown"}
              descritpion={"Create a new project "}
              buttontext={"Create project"}
              buttonAction={onCreateproject}
            />
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {project.map((p) => (
              <ProjectCard
              key={p._id}
              project={p}
              workspaceid={workspaceid}
              projectprogress={p.progress ?? null}
              />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
