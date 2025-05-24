
import ProjectsTools from "./projects";
import TeamsManagement from "./teams";
import { useQuery } from "@tanstack/react-query";
import { useDispatch , useSelector } from "react-redux";
import { setState } from "@/app/redux/features/admin-site";
import { getRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { AdminSite } from "@/types/states/admin";
import UserManager from "./tools/users-manager";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import UserViewer from "./users-viewer";
import TaskStatusManager from "./tools/tasks-status-manager";
import { TaskCategory, TaskStatus } from "@/types/states/tasks";
import { setCategories, setTaskStatuses } from "@/app/redux/features/tasks-sites";

type TaskMangerResponse = {
  task_statuses:TaskStatus[];
  task_categories:TaskCategory[];
}


export default function AdminTools() {
  const {token} = useAppContext()
  const dispatch = useDispatch();
  const { data , isLoading } = useQuery({
    queryKey:["admin-site"],
    queryFn: async () => {
      const response = await getRequests({
        url: "admin/site_data",
        token: token as string,
      })
      dispatch(setState(response as AdminSite))
      return response as AdminSite;
    }
  });
  const { data:TaskManger , isLoading:TaskMangerLoader } = useQuery({
    queryKey:["tasks"],
    queryFn: async () => {
         const response = await getRequests({
              url: "admin/task_manager",
              token: token as string,
         })
         const responseData = response as TaskMangerResponse;
         dispatch(setCategories(responseData.task_categories));
         dispatch(setTaskStatuses(responseData.task_statuses));
         return responseData;
    }
});
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <Box className="max-w-[90vw] mx-auto my-2">
      <Masonry
        className="px-5 py-1 w-[90vw]"
        columns = {3}
        spacing={1}
        defaultHeight={250}
        defaultColumns={3}
        sequential
      >
        <TeamsManagement />
        <UserManager />
        <ProjectsTools />
        <UserViewer />
        <TaskStatusManager />
      </Masonry>
    </Box>
  );
}
