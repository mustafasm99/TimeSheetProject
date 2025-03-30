"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequests, putRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { useRef, useEffect, useState } from "react";
import GetDateString from "@/components/util/return_date_string";
import TeamMembersHolder from "@/components/pages/team-members-holder";
import { PlayCircle, StopCircle } from "lucide-react";
import { FullTask } from "@/types/pages";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setTask,
  startCounting,
  stopeCounting,
  setCounterTime,
  incrementCounter,
} from "@/app/redux/features/current-task";
import { useAppSelector } from "@/app/redux/store";
import { formatTime } from "@/util/timer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/types/states/tasks";

export default function Page() {
  const dispatch = useDispatch();
  const { task_id } = useParams();
  const { token } = useAppContext();
  const currentTask = useAppSelector((state) => state.CurrentTaskReducer);
  const [taskStatusId , setTaskStatusId] = useState<string>("");
  
  const {data:taskStatus , error:statusError , isLoading:loadingStatus} = useQuery({
    queryKey: ["task_status"],
    queryFn: async() => {
      const response = await getRequests({
        url: "task_status",
        token: token || "",
      });
      return response as TaskStatus[];
    }
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["task", task_id],
    queryFn: async () => {
      const res: FullTask = await getRequests({
        url: `pages/task/${task_id}`,
        token: token || "",
      });
      const start = new Date(res.task.start_time);
      const end = res.task.end_time
        ? new Date(res.task.end_time)
        : new Date(Date.now());
      dispatch(setTask(res));
      setTaskStatusId(res.task.status_id.toString());
      return res;
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["task_counter"],
    mutationFn: async () => {
      return await putRequests({
        url: `task/${task_id}`,
        token: token || "",
        data: data
          ? {
              is_counting: currentTask.task.is_counting,
              title: data.task.title,
              description: data.task.description,
              start_time: data.task.start_time,
              end_time: new Date().toISOString(),
              status_id: taskStatusId != "" ? parseInt(taskStatusId) : data.task.status_id,
              category_id: data.task.category_id,
              project_id: data.task.project_id,
            }
          : {},
      });
    },
    onMutate: () => {
      dispatch(stopeCounting());
      toast.success(`Task < ${data?.task.title} > stopped successfully`);
    },
  });
  const { mutate: StartTask } = useMutation({
    mutationKey: ["task_counter"],
    mutationFn: async () => {
      return await putRequests({
        url: `task/${task_id}`,
        token: token || "",
        data: data
          ? {
              is_counting: true,
              title: data.task.title,
              description: data.task.description,
              start_time: new Date().toISOString(),
              end_time: new Date().toISOString(),
              status_id: data.task.status_id,
              category_id: data.task.category_id,
              project_id: data.task.project_id,
            }
          : {},
      });
    },
    onMutate: () => {
      dispatch(startCounting());
      toast.success(`Task < ${data?.task.title} > running successfully`);
    },
  });
  let intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (currentTask.task.is_counting) {
      intervalRef.current = setInterval(() => {
        dispatch(incrementCounter((prev) => prev + 1));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentTask.task.is_counting, dispatch]);

  if (!data) return null;
  return (
    <div className="flex flex-col justify-center items-center min-h-[700px]">
      <div className="min-w-[500px] min-h-[500px] bg-blue-900 rounded-lg shadow-md p-4 flex flex-col gap-2 items-center justify-around">
        <div className="flex flex-row w-full justify-between items-center">
          <h1 className="font-bold text-black text-xl capitalize">
            {GetDateString(data.task.start_time.toString())}
          </h1>
          <h1 className="font-bold text-black text-xl capitalize">
            {GetDateString(data.task.end_time.toString())}
          </h1>
        </div>

        <h1 className="text-xl font-bold capitalize text-fontColor">
          {data.task.title}
        </h1>
        <h1 className="text-sm font-bold capitalize text-fontColor">
          {data.task.description.length < 50
            ? data.task.description
            : data.task.description.slice(0, 50) + "..."}
        </h1>

        <div className="flex flex-col w-full justify-center items-center">
          <button
            onClick={() => {
              if (!currentTask.task.is_counting) {
                StartTask();
              } else {
                mutate();
              }
            }}
            className="font-bold px-4 py-2 rounded-lg"
          >
            {currentTask.task.is_counting ? (
              <StopCircle className="h-20 w-20" />
            ) : (
              <PlayCircle className="h-20 w-20" />
            )}
          </button>
          <h1>{formatTime(currentTask.currentCounter)}</h1>
        </div>

        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <h3 className="text-md font-bold capitalize text-black">
            <Select
              onValueChange={(value) => {
                setTaskStatusId(value);
                dispatch(
                  setTask({
                    ...data,
                    task: { ...data.task, status_id: parseInt(value) },
                  })
                );
                mutate();
                toast.success(`Task < ${data?.task.title} > status updated`);
              }}
            >
              <SelectTrigger className="bg-transparent border-none text-white">
                <SelectValue placeholder={loadingStatus?"loading ...":data.task_status && data.task_status.status } />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {taskStatus?.map((status) => (
                    <SelectItem key={status.id} value={status.status}>
                      {status.status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </h3>
          <TeamMembersHolder
            key={data.task.id}
            showMembers={4}
            team_members={data.task_assignees || []}
          />
        </div>
      </div>
    </div>
  );
}
