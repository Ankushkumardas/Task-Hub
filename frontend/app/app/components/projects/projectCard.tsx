import React from 'react'
import { Link } from 'react-router';
import type { Project } from '~/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getTaskStatusColor } from '~/lib';
import { Progress } from '../ui/progress';
import { format } from 'date-and-time';
interface ProjectCardProps {
    project: Project;
    workspaceid: string;
    projectprogress: number|null;
    // Add other props if needed
}

type Props = ProjectCardProps;
const ProjectCard:React.FC<ProjectCardProps> = ({project,workspaceid,projectprogress}) => {
  console.log(project)

  // const [progress, setProgress] = React.useState(projectprogress)

  // React.useEffect(() => {
  //   const timer = setTimeout(() => setProgress(10), 500)
  //   return () => clearTimeout(timer)
  // }, [])

  
  return (
    <div className=''>
      <Link to={`/workspaces/${workspaceid}/projects/${project._id}`}>
     <Card>
      <CardHeader>
        <CardTitle><div className=' flex items-center justify-between'>
           {project.title.charAt(0).toUpperCase()}{project.title.slice(1)}
          <span className={` px-2 py-1 rounded-xl text-white text-xs ${getTaskStatusColor(project.status)}`}>{project.status}</span>
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
              <Progress value={projectprogress} className='w-40'/>
          </div>
          <div className=' flex items-center justify-between'>
            <div>
        <span>{project.tasks?.length}</span>
        <span>Tasks</span>
            </div>
            <div>
              {
                project.dueDate&& format((project.dueDate),"DD/MM/YYYY")
              }
            </div>
          </div>
        </div>
      </CardContent>
     </Card>
           </Link>
    </div>
  )
}

export default ProjectCard
