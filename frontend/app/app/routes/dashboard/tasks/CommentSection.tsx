import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAddComments, useGetComments } from "~/hooks/useTask";

const CommentSection = ({
  taskid,
  members,
}: {
  taskid: string;
  members: string[];
}) => {
  //   console.log(taskid,members);
  const { mutate, isPending } = useAddComments();
  const [newcomment, setnewcomment] = useState("");
  const { data, isPending: commentsLoading, isError } = useGetComments(taskid);
  const comments = data?.comments ?? [];
  console.log(comments);
  const handleaddcomment = () => {
    mutate(
      { taskid, text: newcomment },
      {
        onSuccess: (data: any) => {
          console.log(data);
          toast.success("Comment addedd");
          setnewcomment("");
        },
        onError: (error: any) => {
          toast.error("error adding comment");
        },
      }
    );
  };
  return (
    <>
      <ScrollArea className="h-[200px]">
        {commentsLoading ? (
          <div>Loading comments...</div>
        ) : comments.length > 0 ? (
         <>
         {comments.map((m: any) => {
          return (
            <div className="flex items-start gap-2 p-2 mb-2 bg-white rounded shadow">
              <span className="text-blue-500 mt-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"/>
                </svg>
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-700">{m.author?.name ?? "Unknown"}</span>
                <span className="text-xs text-gray-400">
                    {m.createdAt ? formatDistanceToNow(new Date(m.createdAt), { addSuffix: true }) : ""}
                </span>
                </div>
                <p className="text-gray-800">{m.text}</p>
              </div>
            </div>
          );
        })}</>
        ) : (
          <div>
            <p>NO Comments</p>
          </div>
        )}
       
      </ScrollArea>
      <div className="flex items-center gap-2">
        <input
          name=""
          id=""
          value={newcomment}
          onChange={(e) => setnewcomment(e.target.value)}
          className=" w-full px-2 py-1 rounded-md border border-slate-300"
        />
        <Button disabled={!newcomment.trim()} onClick={handleaddcomment}>
          Add Comment
        </Button>
      </div>
    </>
  );
};

export default CommentSection;
