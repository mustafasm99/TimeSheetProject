"use client"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { ProjectPageResponse } from "@/types/pages";
import { ProjectPageHeader } from "@/components/pages/project-page";


export default function Page(){
     const prams = useParams();
     const {token} = useAppContext()
     const project_id =  prams?.project_id
     console.log(project_id , "Project ID")
     const {data , isLoading, isError} = useQuery({
          queryKey:["project", project_id],
          queryFn: async () => {
               const res = await getRequests({
                    url: `pages/project_page/${project_id}`,
                    token:token || "",
               })
               return res as ProjectPageResponse
          }
     })
     console.log(data , "Data")
     if(isLoading){
          return <div>Loading...</div>
     }
     if(data){
          return (
               <div>
                    <ProjectPageHeader data={data}/>
               </div>
          )
     }
}