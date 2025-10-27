import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUpdateTasktitle } from "~/hooks/useTask";
import { useQueryClient } from "@tanstack/react-query";

const TaskTitle = ({ title, taskid }: { title: string; taskid: string }) => {
    const [isediting, setisediting] = useState(false);
    const [inputTitle, setInputTitle] = useState(title);
   
    const { mutate, isPending } = useUpdateTasktitle();

    const updatetitle = () => {
        mutate(
            { taskid, title: inputTitle },
            {
                onSuccess: (data: any) => {
                    setisediting(false);
                    toast.success("Title updated ");
                },
                onError: (error: any) => {
                    toast.error("Error updating title");
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-3">
            {isediting ? (
                <Input
                    className="text-2xl font-bold mb-0 w-auto"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                />
            ) : (
                <h2 className="text-2xl font-bold mb-0">{title}</h2>
            )}
            {isediting ? (
                <Button
                    className="h-10 px-4 py-2 text-base font-semibold"
                    onClick={updatetitle}
                >
                    {isPending ? "Updating" : "Update"}
                </Button>
            ) : (
                <Button
                    className=" text-base font-semibold"
                    onClick={() => setisediting(true)}
                >
                    Edit
                </Button>
            )}
        </div>
    );
};

export default TaskTitle;
