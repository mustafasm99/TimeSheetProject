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
import { getRequests, postRequests } from "@/server/base/base_requests";
import { ProjectType } from "@/types/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTask } from "@/app/redux/features/my-tasks";
import { FullTask } from "@/types/pages";



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

  const {
    data:projects
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getRequests({
        url:"project",
        token:token
      });
      return response as ProjectType[]
    },
  });

  const current_profile = useQueryClient().getQueryData<profileMe>(["profile"]);
  const dispatch = useDispatch();
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
    is_counting: false,
    work_time: 0,
  });
  const mutation = useMutation({
    mutationKey: ["create_task"],
    mutationFn: async () => {
      const response = await postRequests({
        url: "task",
        token: token,
        data: task,
      })
      return response as FullTask
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success("Task Created Successfully");
      dispatch(addTask(response));
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
    mutation.mutate()
  }

  
  return (
    <div 
    className={`
        absolute border-2 border-white flex flex-col justify-start bg-mainColor p-3 h-full w-1/3 transition-all duration-500 z-30
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
                multiple={true}
                title="Select Assignee"
                option={options}
                value={options.filter(option => task.assignee.includes(option.value as number))} 
                onChange={(value: selectOption[]) => {
                  setTask({
                    ...task,
                    assignee: value.map((val: selectOption) => parseInt(val.value.toString())),
                  });
                }}
              />
            )}
          </div>
          <Line></Line>
          <div className="flex flex-row justify-start align-center items-center w-full">
            <label
              htmlFor="assignee"
              className="w-[fit-content] mx-1 flex-shrink h-[fit-content]"
            >
              Project:
            </label>
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <Select
                onValueChange={(value) => {
                  setTask({
                    ...task,
                    project_id: parseInt(value),
                  });
                }
                }
              >
                <SelectTrigger className="bg-transparent border-white mx-2 text-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString() || ""}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
              value={new Date(task.end_time).toISOString().split("T")[0]}
              onChange={(e) =>
                setTask({
                  ...task,
                  end_time: new Date(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-row justify-start align-center items-center w-full my-8">
            <label
              htmlFor="Task Status"
              className="w-[fit-content] mx-1 flex-shrink h-[fit-content]"
            >
              Task Status:
            </label>
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <Select
                onValueChange={(value) => {
                  setTask({
                    ...task,
                    status_id: parseInt(value),
                  });
                }
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Task Status" />
                </SelectTrigger>
                <SelectContent>
                    {taskStatus?.map((status) => (
                      <SelectItem key={status.value} value={status.value.toString()}>
                        {status.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="my-4 flex flex-row w-full items-center">
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
              {/* <TabsTrigger value="Activities">Activities</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger> */}
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
        className="p-2 bg-white text-mainColor font-bold rounded-full shadow-md transition-all duration-500"
      >
        <Plus className={`h-8 w-8 `}
          style={{
            transform: hidden ? "rotate(0deg)" : "rotate(45deg)",
            transition: "transform 0.5s",
          }}
        />
      </button>
    </div>
  );
}