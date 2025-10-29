import { useState } from "react";
import { useGetMytasks } from "~/hooks/useTask";
import { format } from "date-fns";
import { useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";

const TaskList = () => {
  const { data: tasks = [], isLoading } = useGetMytasks();
  const [searchParams] = useSearchParams();
  const initialfilter = searchParams.get("status") || "all";
  const initialsort = searchParams.get("sort") || "newest";
  const initialsearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialfilter);
  const [sort, setSort] = useState(initialsort);
  const [search, setSearch] = useState(initialsearch);

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
    if (filter === "all") return true;
    if (filter === "To Do") return task.status === "To Do";
    if (filter === "In Progress") return task.status === "In Progress";
    if (filter === "Done") return task.status === "Done";
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
        <Button onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}>
          {sort === "newest" ? "Newest" : "Oldest"}
        </Button>

        <Select onValueChange={(value) => setFilter(value)} value={filter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px] px-2 py-2 h-9"
        />
      </div>

      {/* Task cards */}
      <div className="flex flex-wrap gap-4 items-center ">
        {sortedTasks.map((task) => (
          <Card key={task._id} className="max-w-[280px] max-h-[170px]">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Title: 
                <span className=" text-slate-700 font-semibold">{task.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 -mt-6">
              <p className="text-sm text-muted-foreground">Description: 
                {task.description.length > 50
                  ? task.description.slice(0, 50) + "..."
                  : task.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Created At: {format(new Date(task.createdAt), "PPpp")}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {task.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Due: {format(new Date(task.dueDate), "PP")}
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
