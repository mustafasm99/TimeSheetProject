import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { deleteRequests, getRequests, postRequests } from "@/server/base/base_requests";
import { toast } from "react-hot-toast";
import { useAppContext } from "@/context";
import { useAppSelector } from "@/app/redux/store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskStatus, removeTaskStatus } from "@/app/redux/features/tasks-sites";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskStatus } from "@/types/states/tasks";

const TaskStatusSchema = z.object({
  task_status: z
    .string()
    .min(3, "the name of the task status must be more than 3 chars")
    .max(50, "the name of the task status must be less than 50 characters"),
});

export default function TaskStatusManager() {
  const [taskStatus, setTaskStatus] = useState<z.infer<typeof TaskStatusSchema>>({
     task_status: "",
  });
  const dispatch = useDispatch();
  const { token } = useAppContext();
  const tasks = useAppSelector((state) => state.TaskStore);
  const { mutate } = useMutation({
    mutationKey: ["Create-task-status"],
    mutationFn: async () => {
      const response = await postRequests({
        url: "task_status/",
        token: token as string,
        data: {
          status: taskStatus.task_status,
        },
      });
      dispatch(addTaskStatus(response as TaskStatus));
      return response;
    },
  });

  return (
    <div className="max-w-7xl px-4 py-4 sm:px-6 lg:px-8 bg-blue-950 rounded-lg">
      <h1 className="text-2xl font-semibold text-white">Task Status Manager</h1>
      <form action="" className="flex flex-col gap-4 my-4"
          onSubmit={(e) => {
               e.preventDefault();
               const result = TaskStatusSchema.safeParse(taskStatus);
               if (result.success) {
                    mutate();
                    toast.success("Task Status Added");
               } else {
                    for(let error of result.error.errors){
                         toast.error(error.message);
                    }
               }
          }}
      >
        <Label>
          <span>Task Status</span>
        </Label>
        <input
          type="text"
          className=" h-10 rounded-md bg-white text-black px-2"
          placeholder="Status Name"
          value={taskStatus.task_status}
          onChange={(e) => setTaskStatus({ task_status: e.target.value })}
        />
        <Button type="submit">Add Task Status</Button>
      </form>
        <Separator
          className=""
          style={{
            color: "white",
            backgroundColor: "white",
            height: "2px",
          }}
        />
        <ScrollArea className="h-40">
          {
               tasks.task_statuses?.map((task) => (
               <div key={task.id} className="flex flex-row justify-between items-center my-2 bg-white p-2 rounded-lg">
                    <span className="text-black font-bold">{task.status}</span>
                    <Button
                         className="bg-red-500 text-white hover:bg-red-700"
                         onClick={() => {
                              toast.promise(
                                   deleteRequests({
                                        url: `task_status/${task.id}/`,
                                        token: token as string,
                                   }),
                                   {
                                        loading: "Deleting...",
                                        success: ()=>{
                                             dispatch(removeTaskStatus(task.id));
                                             return "Deleted";
                                        },
                                        error: "Failed to delete",
                                   }
                              )
                         }}
                         >
                         Delete
                    </Button>
               </div>
               ))
          }
        </ScrollArea>
    </div>
  );
}
