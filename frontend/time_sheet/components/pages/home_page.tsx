import { getRequests } from "@/server/base/base_requests";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context";
import ProjectBox from "./project_box";
import { UserDashboardTypeResponse } from "@/types/pages";
import TaskLists from "./task_lists";



export default function HomePage(){
     const {token} = useAppContext();
     const {data , isLoading} = useQuery(
          {
               queryKey:["home"],
               queryFn:async()=>{
                    const response = await getRequests({
                         url:"pages/user_dashboard",
                         token:token||"",
                    })
                    return response;
               },
          }
     );
     if(isLoading){
          return (
               <div>
                    Loading...
               </div>
          )
     }

     return data && (
          <div className="flex flex-col gap-5  my-2 w-full flex-wrap">
               <div className="flex flex-row gap-2 items-start justify-start">
                    <ProjectBox data={data.current_project} tasks={data.my_tasks} />
                    <TaskLists data={data.my_tasks} />
               </div>
          </div>
     );
}