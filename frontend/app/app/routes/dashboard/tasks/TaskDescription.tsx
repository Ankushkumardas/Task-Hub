import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUpdateTaskDescription } from "~/hooks/useTask";

const TaskDescription = ({ description, taskid }: { description: string; taskid: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputDesc, setInputDesc] = useState(description);

    const { mutate, isPending } = useUpdateTaskDescription();

    const updateDescription = () => {
        mutate(
            { taskid, description: inputDesc },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success("Description updated");
                },
                onError: () => {
                    toast.error("Error updating description");
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-3">
            {isEditing ? (
                <Input
                    className="mb-0 w-auto"
                    value={inputDesc}
                    onChange={(e) => setInputDesc(e.target.value)}
                />
            ) : (
                <span className="text-gray-600">{description}</span>
            )}
            {isEditing ? (
                <Button

                    onClick={updateDescription}
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save"}
                </Button>
            ) : (
                <Button
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </Button>
            )}
        </div>
    );
};

export default TaskDescription;
