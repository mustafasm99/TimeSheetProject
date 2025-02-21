import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/redux/store";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postRequests , deleteRequests} from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowBigRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { add_project, add_project_status } from "@/app/redux/features/admin-site";
import ProjectStatus from "./tools/project-status-management";

const CreateProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  project_manager_id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  team_id: z.number(),
  members_limit: z.number(),
});

export default function ProjectsTools() {
 
  const dispatch = useDispatch();
  const adminData = useAppSelector((state) => state.AdminStore);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [projectStatus , setProjectStatus] = useState<string>("");
  const [formData, setFormData] = useState<z.infer<typeof CreateProjectSchema>>(
    {
      title: "",
      description: "",
      project_manager_id: 0,
      start_date: "",
      end_date: "",
      team_id: 0,
      members_limit: 0,
    }
  );
  const { token } = useAppContext();
  const { mutate } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async () => {
      const response = await postRequests({
        url: "project/",
        token: token || "",
        data: formData,
      });
      dispatch(add_project(response));
      toast.success("Project Created");
    },
  });

  const {mutate:deleteProject} = useMutation({
     mutationKey: ["delete-project"],
     mutationFn: async (id:number) => {
       const response = deleteRequests({
          url: `project/${id}`,
          token: token || "",
       });
       toast.success("Project Deleted");
     }
  })

  return (
    <div className="flex flex-row justify-start items-start min-w-[720px]">
      <div className="w-full h-fit p-5 bg-white rounded-l-xl flex flex-col justify-start items-start gap-2">
        <h1 className="font-bold text-black text-xl ">Project Management</h1>
        <form
          action=""
          className="my-5 flex flex-col gap-2 justify-start items-start w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (CreateProjectSchema.safeParse(formData).success) {
              mutate();
            } else {
              toast.error("Invalid form data");
            }
          }}
        >
          <Label className="text-black font-bold text-md ">Project Title</Label>
          <Input
            type="text"
            className="w-full min-h-10 bg-white text-black"
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
              });
            }}
          />
          <Label className="text-black font-bold text-md ">
            Project Description
          </Label>
          <textarea
            name=""
            id=""
            className="text-black w-full min-h-20 bg-white border border-black rounded-lg"
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          ></textarea>
          <Label className="text-black font-bold text-md ">
            Project Leader
          </Label>
          <Select
            onValueChange={(e) => {
              setFormData({
                ...formData,
                project_manager_id: parseInt(e),
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project Leader" />
            </SelectTrigger>
            <SelectContent>
              <Input
                placeholder="Search Project Leader"
                className="my-5"
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <SelectGroup>
                {adminData.users
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchUser.toLowerCase())
                  )
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label className="text-black font-bold text-md ">
            Project Start Date
          </Label>
          <Input
            type="date"
            className="w-full min-h-10 bg-white text-black"
            onChange={(e) => {
              setFormData({
                ...formData,
                start_date: e.target.value,
              });
            }}
          />
          <Label className="text-black font-bold text-md ">
            Project End Date
          </Label>
          <Input
            type="date"
            className="w-full min-h-10 bg-white text-black"
            onChange={(e) => {
              setFormData({
                ...formData,
                end_date: e.target.value,
              });
            }}
          />
          <Label className="text-black font-bold text-md ">Select Team</Label>
          <Select
            onValueChange={(e) => {
              setFormData({
                ...formData,
                team_id: parseInt(e),
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              <Input
                placeholder="Search Team"
                className="my-5"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SelectGroup>
                {adminData.teams
                  .filter((team) =>
                    team.name.toLowerCase().includes(searchTerm.toLowerCase())&&
                    team.id !== undefined
                  )
                  .map((filteredTeam) => (
                    <SelectItem key={filteredTeam.id} value={filteredTeam.id.toString()}>
                      {filteredTeam.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label className="text-black font-bold text-md ">Member Limit</Label>
          <Input
            type="number"
            className="w-full min-h-10 bg-white text-black"
            onChange={(e) => {
              setFormData({
                ...formData,
                members_limit: parseInt(e.target.value),
              });
            }}
          />

          <Button className="w-full border-black border">Create Project</Button>
        </form>
      </div>
      <div className="w-fit h-fit p-5 bg-white rounded-r-xl rounded-bl-xl flex flex-col justify-start items-start gap-2">
        
        <h1 className="font-bold text-black text-xl mt-5">
          Projects List
        </h1>
        
        <ScrollArea className="w-full h-96">
          {adminData.projects.map((project) => (
            <div key={project.id} className="bg-black rounded-lg p-4 w-full my-2">
              <h1>{project?.name}</h1>
              <div className="flex flex-row justify-between items-center">
                <span className="text-white">
                  {new Date(project?.start_time).toLocaleDateString()}
                </span>
                <ArrowBigRight fill="white" />
                <span className="text-white">
                  {new Date(project.end_time).toLocaleDateString()}
                </span>
              </div>
              <Badge variant="secondary">
                {
                  adminData.teams.find((team) => team.id === project.team_id)
                    ?.team_leader.email
                }
              </Badge>
              <div className="flex flex-row justify-center items-center gap-2 mt-4">
                <button className="border-white border rounded-lg p-2"
                    onClick={() => {
                         deleteProject(project.id);
                    }}
                    >
                  Delete
                </button>
                <Select
                onValueChange={(e) => {
                  setFormData({
                    ...formData,
                    team_id: parseInt(e),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Project Status" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    placeholder="Search Status"
                    className="my-5"
                    onChange={(e) => setSearchStatus(e.target.value)}
                  />
                  <SelectGroup>
                    {adminData && adminData.project_statuses
                      .filter((team) =>
                        team.title
                          .toLowerCase()
                          .includes(searchStatus.toLowerCase())
                        && team.id !== undefined
                      )
                      .map((filteredTeam) => (
                        <SelectItem key={filteredTeam.id}  value={filteredTeam ? filteredTeam?.id.toString() : ""}>
                          {filteredTeam.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              </div>
              
            </div>
          ))}
        </ScrollArea>
        <h1 className="font-bold text-black text-xl mt-5">
          Project Status
        </h1>
        <ProjectStatus />
      </div>
      
    </div>
  );
}
