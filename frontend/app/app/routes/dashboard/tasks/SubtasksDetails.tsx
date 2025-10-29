import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAddSubtaskToTask, useUpdateSubtaskOfTask } from "~/hooks/useTask";
import type { TaskSubtask } from "~/types";

const SubtasksDetails = ({
  subtasks,
  taskid,
}: {
  subtasks: TaskSubtask[];
  taskid: string;
}) => {
  const [newsubtasks, setNewSubtasks] = React.useState<TaskSubtask[]>(subtasks);
  const { mutate: addsubtask } = useAddSubtaskToTask();
  const { mutate: updatesubtask } = useUpdateSubtaskOfTask();

  const handletoggletask = (checked: boolean, subtaskid: string) => {
    const subtaskToUpdate = newsubtasks.find(
      (subtask) => subtask._id === subtaskid
    );
    if (!subtaskToUpdate) return;

    const updated = { ...subtaskToUpdate, completed: checked === true };

    updatesubtask(
      {
        taskid: taskid,
        subtaskid: subtaskid,
        title: updated.title,
        completed: updated.completed,
      },
      {
        onSuccess: () => {
          setNewSubtasks((subtasks) =>
            subtasks.map((sub) => (sub._id === subtaskid ? updated : sub))
          );
          toast.success("Subtask updated successfully");
        },
        onError: (error) => {
          console.log("Error updating subtask", error);
          toast.error("Error updating subtask");
        },
      }
    );
  };


  // Track which subtask is being edited and its title
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const handleEdit = (subtask: TaskSubtask) => {
    setEditingSubtaskId(subtask._id);
    setEditTitle(subtask.title);
  };

  const handleSave = (subtask: TaskSubtask) => {
    updatesubtask(
      {
        taskid,
        subtaskid: subtask._id,
        title: editTitle,
        completed: subtask.completed ?? false,
      },
      {
        onSuccess: () => {
          toast.success("Subtask updated successfully");
          setEditingSubtaskId(null);
          setNewSubtasks((subs) =>
            subs.map((sub) =>
              sub._id === subtask._id ? { ...sub, title: editTitle } : sub
            )
          );
        },
        onError: () => toast.error("Error updating subtask"),
      }
    );
  };
  const [subtask, setSubtask] = useState<string>("");

  const addnewsubtask = () => {
    if (subtask.trim() === "") return;
    const newSubtask: TaskSubtask = {
      _id: Date.now().toString(),
      title: subtask,
      completed: false,
    };
    // Call add subtask mutation
    addsubtask(
      { taskid: taskid, title: subtask },
      {
        onSuccess: (data) => {
          console.log("Subtask added successfully", data);
          toast.success("Subtask added successfully");
        },
        onError: (error) => {
          console.log("Error adding subtask", error);
          toast.error("Error adding subtask");
        },
      }
    );

    setNewSubtasks([...newsubtasks, newSubtask]);
    setSubtask("");
  };
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a new subtask"
            value={subtask}
            onChange={(e) => setSubtask(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addnewsubtask}>Add</Button>
        </div>

        {newsubtasks.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No subtasks available.</p>
        ) : (
          <ScrollArea className=" h-[200px]">

          <div className="space-y-2">
            {newsubtasks.map((item) => {
              const isEditing = editingSubtaskId === item._id;
              return (
                <div
                key={item._id}
                className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handletoggletask(e.target.checked, item._id)}
                    className="accent-primary"
                    />
                  {isEditing ? (
                    <>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1"
                        autoFocus
                        />
                      <Button size="sm" onClick={() => handleSave(item)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingSubtaskId(null)}
                        >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 truncate ${
                          item.completed ? "line-through text-gray-400" : ""
                          }`}
                          >
                        {item.title}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
            </ScrollArea>
        )}
      </div>
    </>
  );
};

export default SubtasksDetails;
