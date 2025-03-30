import { GetMyProfile } from "@/server/profile/get_me";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/redux/store";
import { Bell, Link2, PlayCircle, StopCircle } from "lucide-react";
import { getRequests, putRequests } from "@/server/base/base_requests";
import { FullTask } from "@/types/pages";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  incrementCounter,
  setTask,
  startCounting,
  stopeCounting,
  clearTask,
} from "@/app/redux/features/current-task";
import { formatTime } from "@/util/timer";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileHolder() {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetMyProfile(localStorage.getItem("token") as string),
  });
  const dispatch = useDispatch();
  const { mutate } = useMutation({
    mutationKey: ["task_counter"],
    mutationFn: async ({
      task_id,
      data,
    }: {
      task_id: number;
      data: FullTask;
    }) => {
      const token = localStorage.getItem("token");
      return await putRequests({
        url: `task/${task_id}`,
        token: token || "",
        data: data
          ? {
              is_counting: data.task.is_counting,
              title: data.task.title,
              description: data.task.description,
              start_time: data.task.start_time,
              end_time: new Date().toISOString(),
              status_id: data.task.status_id,
              category_id: data.task.category_id,
              project_id: data.task.project_id,
            }
          : {},
      });
    },
    onMutate: ({ data }) => {
      toast.success(
        `Task < ${data.task.title} > ${
          data.task.is_counting ? "starting" : "stopping"
        } successfully`
      );
    },
  });
  const { error: noCounter } = useQuery({
    queryKey: ["current_task"],
    queryFn: async () => {
      const response = await getRequests({
        url: "task/current",
        token: token || "",
      });
      dispatch(setTask(response as FullTask));
      return response;
    },
  });
  if (noCounter && !pathname.includes("task")) {
    dispatch(clearTask());
  }
  const currentTask = useAppSelector((state) => state.CurrentTaskReducer);
  let intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (currentTask.task.is_counting && !pathname.includes("task")) {
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

  return (
    <div className="container p-3 flex-grow bg-mainColor rounded-lg">
      {isLoading && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {data && (
        <div className="flex flex-row justify">
          <div className="text-bold text-center text-white flex flex-col flex-1 w-fit gap-1 justify-start items-start">
            {currentTask.task.id !== 0 ? (
              <div className="flex flex-col gap-1 w-fit justify-start items-start border border-white rounded-lg p-2 bg-gray-900 px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full">
                  <h1 className="text-white font-bold text-lg">
                    {currentTask.task.title}
                  </h1>
                  <button 
                    onClick={() => {
                      router.push("/task/" + currentTask.task.id);
                    }}
                    className="flex flex-row justify-center items-center"
                  >
                    <Link2 className="h-5 w-5 text-white ml-2" />
                  </button>
                </div>
                <div className="flex flex-row justify-between w-full items-center">
                  <p className="font-bold text-white bg-green-950 px-1  rounded-lg">
                    {formatTime(currentTask.currentCounter)}
                  </p>
                  {currentTask.task.is_counting ? (
                    <button
                      onClick={() => {
                        dispatch(stopeCounting());
                        mutate({
                          task_id: currentTask.task.id as number,
                          data: currentTask,
                        });
                      }}
                      className="font-bold rounded-lg"
                    >
                      <StopCircle className="h-5 w-5" />
                      
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(startCounting());
                        mutate({
                          task_id: currentTask.task.id as number,
                          data: currentTask,
                        });
                      }}
                      className="font-bold  rounded-lg"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p>no current task</p>
            )}
          </div>

          {/* <button className="mx-4 my-2 ">
            <Bell className="w-6 h-6 text-white" />
          </button> */}

          {/* the image here  */}
          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={data.profile_image}
                  alt="profile image"
                  className="w-[50px] h-[50px] rounded-full content-center object-cover"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {data.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DropdownMenuLabel>
                    <button
                      onClick={()=>{
                        router.push('/attendance')
                      }}
                    >
                      My Attendance 
                    </button>
                  </DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DropdownMenuLabel>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.clear();
                        router.push("/");
                      }}
                    >
                      Logout
                    </button>
                  </DropdownMenuLabel>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}
