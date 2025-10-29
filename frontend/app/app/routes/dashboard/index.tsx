import React from "react";
import { useSearchParams } from "react-router-dom";
import { useGetWorkspaceStatsQuery } from "~/hooks/useWorkspace";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("workspaceid");
  const { data, isPending, isError } = useGetWorkspaceStatsQuery(id as string);

  type Statuses = {
    todo?: number;
    inProgress?: number;
    completed?: number;
    done?: number;
    [key: string]: any;
  };

  const chartData = data?.tasksByStatusPerDay
    ? Object.entries(data.tasksByStatusPerDay).map(([day, statuses]) => {
        const s = statuses as Statuses;
        return {
          day,
          todo: s.todo ?? 0,
          inProgress: s.inProgress ?? 0,
          completed: s.completed ?? 0,
          done: s.done ?? 0,
        };
      })
    : [];

  if (isPending)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading workspace stats...</span>
      </div>
    );

  if (isError || !data)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load workspace statistics.
      </div>
    );

  const {
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    priorityStats,
    last7DaysTasks,
    projects,
  } = data;

  const pHigh = priorityStats?.High ?? 0;
  const pMedium = priorityStats?.Medium ?? 0;
  const pLow = priorityStats?.Low ?? 0;
  const safeLast7 = last7DaysTasks ?? [];
  const safeProjects = projects ?? [];

  return (
    <div className="p-6 space-y-8">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Workspace Dashboard</h1>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Projects", value: totalProjects },
          { title: "Total Tasks", value: totalTasks },
          { title: "In Progress", value: inProgressTasks, color: "text-yellow-500" },
          { title: "Completed", value: completedTasks, color: "text-green-500" },
        ].map((card) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${card.color ?? ""}`}>{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ===== Charts Row ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Last 7 Days Tasks */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>📈 Tasks Created (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeLast7}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Priority */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>🎯 Task Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { priority: "High", count: pHigh },
                    { priority: "Medium", count: pMedium },
                    { priority: "Low", count: pLow },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks by Status per Day */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>📅 Tasks by Status Per Day</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {chartData.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No data available for this chart.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="todo" fill="#f59e42" name="To Do" />
                    <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="done" fill="#6366f1" name="Done" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== Tables Row ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Projects Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>🧾 Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeProjects.map((proj: any) => (
                    <TableRow key={proj._id}>
                      <TableCell className="font-medium">{proj.title}</TableCell>
                      <TableCell>{proj.status}</TableCell>
                      <TableCell>{proj.progress}%</TableCell>
                      <TableCell>{proj.tasks?.length}</TableCell>
                      <TableCell>
                        {proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subtasks Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>📝 All Subtasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.allSubtasks ?? []).map((subtask: any) => (
                    <TableRow key={subtask._id}>
                      <TableCell className="font-medium">{subtask.title}</TableCell>
                      <TableCell>
                        {subtask.completed ? (
                          <span className="text-green-600 font-semibold">Completed</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {subtask.createdAt ? new Date(subtask.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
