"use client";

import { getRequests } from "@/server/base/base_requests";
import {useQuery} from "@tanstack/react-query";
import { useAppContext } from "@/context";
import {Spinner} from "@heroui/spinner";
import { FullTask, ProjectBoxType } from "@/types/pages";
import ProjectBox from "@/components/pages/project_box";

type projectsResponse = {
     projects:ProjectBoxType;
     tasks:FullTask[];
}

export default function Projects(){
     const {token} = useAppContext();
     const {data, isLoading, isError} = useQuery(
          {
               queryKey:["projects"],
               queryFn:async()=>{
                    const response = await getRequests({
                         url:"pages/user_projects",
                         token:token|| "",
                    })

                    return response as projectsResponse[];
               }
          }
     )
    if (isLoading){
           return (
                 <div
                    className="flex flex-col justify-center items-center w-full min-h-[60vh]" 
                 >
                         <Spinner size="lg"/>
                 </div>
           )
    }
    if(data && data.length > 0){
     return (
          <div className="flex flex-row justify-start gap-5 items-center">
               {
                    data.map((data, index) => {
                         return (
                              <div onClick={() => {
                                   window.location.href = `/projects/${data.projects.project.id}`
                              }} key={index}>
                                   <ProjectBox key={index} data={data.projects} tasks={data.tasks} />
                              </div>
                         )
                    })
               }
          </div>
     )
}}