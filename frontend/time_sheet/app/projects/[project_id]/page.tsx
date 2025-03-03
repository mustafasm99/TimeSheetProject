"use client"
import { useParams } from "next/navigation"

export default function Page(){
     const prams = useParams();
     const project_id =  prams?.project_id
     console.log(project_id , "Project ID")
     return (
          <div>
               <h1>Projects Page</h1>
          </div>
     )
}