import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
     Select,
     SelectContent,
     SelectGroup,
     SelectItem,
     SelectLabel,
     SelectTrigger,
     SelectValue,
   } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/app/redux/store"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { postRequests } from "@/server/base/base_requests"
import { useAppContext } from "@/context"
import { z } from "zod"

const CreateProjectSchema = z.object({
     title: z.string(),
     description: z.string(),
     project_leader: z.string(),
     start_date: z.string(),
     end_date: z.string(),
     team: z.string(),
})

export default function ProjectsTools(){

     const adminData = useAppSelector(state => state.AdminStore)
     const [searchTerm, setSearchTerm] = useState<string>("")
     const [searchUser , setSearchUser] = useState<string>("")
     const {token} = useAppContext()
     const {mutate} = useMutation({
          mutationKey: ["create-project"],
          mutationFn: async () => {
               const response = postRequests({
                    url: "admin/create_project",
                    token: token || "",
                    data: {
                         title: "",
                         description: "",
                         project_leader: "",
                         start_date: "",
                         end_date: "",
                         team: ""
                    }
               })
          },
     })


     return (
          <div className="min-w-[320px] h-fit p-5 bg-white rounded-xl flex flex-col justify-start items-start gap-2">
               <h1 className="font-bold text-black text-xl ">Project Management</h1>
               <form action="" className="my-5 flex flex-col gap-2 justify-start items-start w-full" >
                    <Label className="text-black font-bold text-md ">
                         Project Title
                    </Label>
                    <Input type="text" className="w-full min-h-10 bg-white"/>
                    <Label className="text-black font-bold text-md ">
                         Project Description
                    </Label>
                    <textarea name="" id="" className="w-full min-h-20 bg-white border border-black rounded-lg">

                    </textarea>
                    <Label className="text-black font-bold text-md ">
                         Project Leader
                    </Label>
                    <Select >
                         <SelectTrigger>
                              <SelectValue placeholder="Select Project Leader"/>
                         </SelectTrigger>
                         <SelectContent>
                              <Input 
                                   placeholder="Search Project Leader" 
                                   className="my-5"
                                   onChange={(e) => setSearchUser(e.target.value)}
                              />
                              <SelectGroup>
                                   {
                                        adminData.users
                                        .filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase()))
                                        .map(user => (
                                             <SelectItem value={user.id.toString()}>{user.name}</SelectItem>
                                        ))
                                   }
                              </SelectGroup>
                         </SelectContent>
                    </Select>
                    <Label className="text-black font-bold text-md ">
                         Project Start Date
                    </Label>
                    <Input type="date" className="w-full min-h-10 bg-white text-black"/>
                    <Label className="text-black font-bold text-md ">
                         Project End Date
                    </Label>
                    <Input type="date" className="w-full min-h-10 bg-white text-black"/>
                    <Label className="text-black font-bold text-md ">
                         Select Team
                    </Label>
                    <Select >
                         <SelectTrigger>
                              <SelectValue placeholder="Select Team"/>
                         </SelectTrigger>
                          <SelectContent>
                                <Input 
                                      placeholder="Search Team" 
                                      className="my-5" 
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <SelectGroup>
                                      {
                                             adminData.teams
                                                   .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                   .map(filteredTeam => (
                                                         <SelectItem value={filteredTeam.id.toString()}>{filteredTeam.name}</SelectItem>
                                                   ))
                                      }
                                </SelectGroup>
                          </SelectContent>
                    </Select>
                    <Button className="w-full border-black border">
                         Create Project
                    </Button>
               </form>
          </div>
     )
};