"use client";
import { Task, TaskType } from "@/types/tasks";
import { useState } from "react";
import Line from "../util/line";
import { useQuery, useQueryClient , useMutation } from "@tanstack/react-query";
import { selectOption, MultiSelect } from "../util/multi_select";
import { GetMyTeams } from "@/server/projects/teams";
import config from "@/settings/configer";
import { GetTaskStatus } from "@/server/tasks/task_status";
import ThumpUserHolder from "../util/thump_user_holder";
import { profileMe } from "@/types/profile_type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";




const hiddenVar = true;

export default function CreateTaskForm() {
  const [hidden, setHidden] = useState(hiddenVar);
  const token = localStorage.getItem("token") as string;
  // get all  teams members
  const { data, error, isLoading } = useQuery({
    queryKey: ["my_teams"],
    queryFn: () => GetMyTeams(token),
  });
  // get all task statuses
  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
  } = useQuery({
    queryKey: ["task_status"],
    queryFn: () => GetTaskStatus(token),
  });

  const current_profile = useQueryClient().getQueryData<profileMe>(["profile"]);

  const apiUrl = config().API_URL;
  const options: selectOption[] =
    data?.members // Extract values from the object
      .map((member) => {
        return {
          label: member.name,
          value: member.id,
          img: apiUrl + member.profile_image,
        };
      }) || [];

  const taskStatus: selectOption[] =
    statusData?.map((status) => {
      return {
        label: status.status,
        value: status.id,
      };
    }) || [];

  const [task, setTask] = useState<TaskType>({
    title: "",
    description: "",
    assignee: [0],
    start_time: new Date(),
    end_time: new Date(),
    status_id: 0,
    category_id: 0,
    project_id: 0,
  });
  const mutation = useMutation({
    mutationKey: ["create_task"],
    mutationFn: () => fetch(`${apiUrl}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    }),
    onSuccess: () => {
      toast.success("Task Created Successfully");
    },
    onError: (error) => {
      toast.error("Error Creating Task :"+error);
    }
  })
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = Task.safeParse(task);
    if (data.error){
      for (const error of data.error.errors) {
        toast.error(error.message);
      }
      return
    }
    console.log(task);
    mutation.mutate()
  }


  const [value, setValue] = useState<selectOption[]>([]);
  const [statusValue, setStatusValue] = useState<selectOption | undefined>(
    undefined
  );
  return (
    <div 
    className={`
        absolute border-2 border-white flex flex-col justify-start bg-mainColor p-3 h-full w-1/3 transition-all duration-500
        ${hidden ? "right-[-35%]" : "right-0"}
        `}
    >
      <form onSubmit={handleSubmit} method="post">
        <div className="flex flex-col gap-5">
          <label htmlFor="title">Task Title</label>
          <div className="flex flex-row justify-between gap-3">
            <input
              name="title"
              className="p-2 rounded-md text-fontColor w-full"
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
          </div>

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
                onChange={(o) => {
                  setValue(o);
                  task.assignee = o.map((v) => v.value as number);
                }}
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
              value={task.end_time.toISOString().split("T")[0]}
              onChange={(e) =>
                setTask({
                  ...task,
                  end_time: new Date(e.target.value),
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
          <Tabs defaultValue="description" className="w-[95%]">
            <TabsList className="bg-transparent flex flex-row justify-between items-center border-b-2 border-black rounded-none">
              <TabsTrigger
                value="description"
                className="bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger value="Activities">Activities</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <textarea
                name="description"
                className="p-2 rounded-md text-fontColor w-full"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              ></textarea>
            </TabsContent>
          </Tabs>

          <button type="submit" className="px-5 py-2 bg-hoverColor rounded-md w-[fit-content] mx-auto">
            <span>Create Task</span>
          </button>
        </div>
      </form>
      <CreateTaskButton
        hidden={hidden}
        setHidden={hidden => setHidden(hidden)}
      />
    </div>
  );
}

type CreateTaskButtonProps = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export function CreateTaskButton(
  { setHidden , hidden }: CreateTaskButtonProps = { setHidden: () => {} , hidden:true}
) {
  
  return (
    <div className="fixed right-0 bottom-0 m-5">
      <button
        onClick={() => setHidden(!hidden)}
        className="p-2 bg-white text-mainColor font-bold rounded-md shadow-md transition-all duration-500"
      >
        {hidden ? "Create Task" : "Close"}
      </button>
    </div>
  );
}