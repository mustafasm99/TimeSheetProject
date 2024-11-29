"use client";
import { Task, TaskType } from "@/types/tasks";
import { useState } from "react";
import { z } from "zod";
import Line from "../util/line";
import { useQuery , useQueryClient} from "@tanstack/react-query";
import { selectOption, MultiSelect } from "../util/multi_select";
import { GetMyTeams } from "@/server/projects/teams";
import config from "@/settings/configer";
import { GetTaskStatus } from "@/server/tasks/task_status";
import ThumpUserHolder from "../util/thump_user_holder";
import { profileMe } from "@/types/profile_type";

export default function CreateTaskForm()  {
  const token = localStorage.getItem("token") as string;
  // get all  teams members
  const { data, error, isLoading } = useQuery({
    queryKey: ["my_teams"],
    queryFn:()  => GetMyTeams(token),
  });
  // get all task statuses
  const { data:statusData, error:statusError, isLoading:statusLoading } = useQuery({
    queryKey: ["task_status"],
    queryFn:()  => GetTaskStatus(token),
  });

  const current_profile = useQueryClient().getQueryData<profileMe>(["profile"]);


  const apiUrl = config().API_URL;
  const options:selectOption[] = data?.members // Extract values from the object
    .map((member) => {
      return {
        label: member.name,
        value: member.id,
        img: apiUrl+member.profile_image,
      };
    }) || [];
  
  const taskStatus:selectOption[] = statusData?.map((status) => {
    return {
      label: status.status,
      value: status.id,
    };
  }) || [] ;

  const [task, setTask] = useState<TaskType>({
    task_title: "",
    task_description: "",
    assignee: { assignee_names: [] },
    due_date: new Date(),
    status: "",
    priority: "",
    project: "",
  });
  const [value, setValue] = useState<selectOption[]>([]);
  const [statusValue, setStatusValue] = useState<selectOption|undefined>(undefined);
  return (
    <div className="absolute border-2 border-white right-0 flex flex-col justify-start bg-mainColor p-3 h-full w-1/3">
      <form action="" method="post">
        <div className="flex flex-col">
          <label htmlFor="title">Task Title</label>
          <div className="flex flex-row justify-between gap-3">
            <input
              name="title"
              className="p-2 rounded-md text-fontColor"
              type="text"
              value={task.task_title}
              onChange={(e) => setTask({ ...task, task_title: e.target.value })}
            />
            <select name="property" id="" className="w-full rounded-md p-1">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <Line />
          <div className="flex flex-row">
            <label htmlFor="description" className="w-full">
              Task Description :{" "}
            </label>
            <textarea
              name="description"
              className="p-2 rounded-md text-fontColor mx-2 w-full"
              value={task.task_description}
              onChange={(e) =>
                setTask({ ...task, task_description: e.target.value })
              }
            ></textarea>
          </div>
          <Line />
          <div className="flex flex-row justify-start align-center items-center w-full">
            <label
              htmlFor="assignee"
              className="w-[fit-content] mx-1 flex-shrink h-[fit-content]"
            >
              Assignee:
            </label>
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <MultiSelect
                title="Select Assignee"
                multiple={true}
                option={options}
                value={value}
                onChange={(o) => setValue(o)}
              />
            )}

          </div>
           <Line></Line> 
          <div className="flex flex-row w-full items-center">
            <label htmlFor="Dou Date" className=" w-[fit-content]">
              Due Date:
            </label>
              <input
                className="p-2 rounded-md text-fontColor mx-2 flex-1 w-full"
                type="date"
                name="due_date"
                value={task.due_date.toISOString().split("T")[0]}
                onChange={(e) =>
                  setTask({
                    ...task,
                    due_date: new Date(e.target.value),
                  })
                }
              />
          </div>
          <div className="flex flex-row justify-start align-center items-center w-full my-10">
            <label
              htmlFor="Task Status"
              className="w-[fit-content] mx-1 flex-shrink h-[fit-content]"
            >
              Task Status:
            </label>
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <MultiSelect
                title="Select Assignee"
                multiple={false}
                option={taskStatus}
                value={statusValue}
                onChange={(o) => setStatusValue(o)}
              />
            )}

          </div>
          <div className="my-10 flex flex-row w-full items-center">
            <label htmlFor="">Created By :</label>
            <ThumpUserHolder 
              img={current_profile?.profile_image}
              name={current_profile?.user?.name || ""}
              dark={true}
             />
          </div> 
        </div>
      </form>
    </div>
  );
}
