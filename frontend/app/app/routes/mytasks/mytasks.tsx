import { useState } from "react";
import { useGetMytasks } from "~/hooks/useTask";
import { format, formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useEffect } from "react";
import { BadgeCheckIcon, CheckCircle, Clock, Clock10Icon, Link2Icon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TaskList = () => {
  const { data: tasks = [], isLoading } = useGetMytasks();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(tasks);

  const initialfilter = searchParams.get("status") || "All";
  const initialsort = searchParams.get("sort") || "newest";
  const initialsearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialfilter);
  const [sort, setSort] = useState(initialsort);
  const [search, setSearch] = useState(initialsearch);

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  useEffect(() => {
    setSearchParams({
      ...params,
      filter,
      sort,
      search,
    });
  }, [filter, sort, search]);
  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
          />
        </AnimatePresence>
      </div>
    );

  const filteredTasks = tasks.filter((task: any) => {
    if (filter === "All") return true;
    if (filter === "To Do") return task.status === "To Do";
    if (filter === "In Progress") return task.status === "In Progress";
    if (filter === "Done") return task.status === "Done";
    if (filter === "Archieve") return task.isArchieved === false;
    if (filter === "Not Archieve") return task.isArchieved === true;
    return true;
  });

  const searchedTasks = filteredTasks.filter(
    (task: any) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTasks = [...searchedTasks].sort((a: any, b: any) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Button
          onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
        >
          {sort === "newest" ? "Newest" : "Oldest"}
        </Button>

        <Select onValueChange={(value) => setFilter(value)} value={filter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Tasks</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
            <SelectItem value="Archieve">Archieve</SelectItem>
            <SelectItem value="Not Archieve">Not Archieve</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px] px-2 py-2 h-9"
        />
      </div>

{/* tabs */}
<div className=" mb-2">
  <Tabs>
    <TabsList>
      <TabsTrigger value="To Do" onClick={()=>setFilter("To Do")}
        className="px-3 py-1 rounded-md"
      >
        To Do
      </TabsTrigger>
      <TabsTrigger value="In Progress" onClick={()=>setFilter("In Progress")}
        className="px-3 py-1 rounded-md"
      >
        Active
      </TabsTrigger>
      <TabsTrigger value="Done" onClick={()=>setFilter("Done")}
        className="px-3 py-1 rounded-md"
      >
        Completed
      </TabsTrigger>
    </TabsList>
  </Tabs>
</div>

      {/* Task cards */}
      <div className="flex flex-wrap gap-4 items-center ">
        {sortedTasks.map((task) => (
          console.log(task),
          <Card key={task._id} className="max-w-[300px] h-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                Title:
                <span className="text-slate-700 font-semibold ml-1">
                  {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                </span>
               
              </CardTitle>
              <CardTitle className="text-sm font-normal flex items-center gap-1">
                {task.status === "To Do" && <Clock10Icon size={14} color="blue" />}
                {task.status === "In Progress" && <Clock size={14} color="orange" />}
                {task.status === "Done" && <BadgeCheckIcon size={14} color="green" />}
                 <Link to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`} ><Link2Icon size={16}/></Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 -mt-6">
              <p className="text-sm text-slate-600 font-semibold">
                Description:{" "}
                <Badge variant={"secondary"} className=" text-slate-500 font-medium">
                  {task.description.length > 50
                    ? task.description.slice(0, 50) + "..."
                    : task.description}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">
                Created At: {formatDistanceToNowStrict(new Date(task.createdAt))} ago
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {task.status}
                </Badge>
                <Badge variant={`${task.priority==="High" ? "destructive" : task.priority==="Medium" ? "secondary" : "secondary"}`} className="text-xs">
                  Priority: <span className={`${task.priority==="Low" ? "text-green-500" : task.priority==="Medium" ? "text-yellow-500" : "text-white"}`}>{task.priority}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Project: {task.project.title}
                </Badge>
                <Badge variant="outline" className="text-xs ">
                  Due: {format(new Date(task.dueDate), "PP")}
                </Badge>
                <Badge variant="outline" className="text-xs ">
                  Updated: {formatDistanceToNow(task.updatedAt)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
