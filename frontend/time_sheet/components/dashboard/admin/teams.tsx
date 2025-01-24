import { useAppContext } from "@/context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery , useMutation } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRequests, postRequests } from "@/server/base/base_requests";
import { TeamType } from "@/types/team";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../../ui/scroll-area";
import { X } from "lucide-react";
import { z } from "zod";
import { UserType } from "@/types/user";
import { Value } from "@radix-ui/react-select";


const CreateTeamSchema = z.object({
     name: z.string(),
     description: z.string(),
     team_leader_id: z.number(),
     members_limit: z.number(),
});


export default function TeamsManagement() {
     const { user, token } = useAppContext();
     const [teams, setTeams] = useState<TeamType[]>([]);
     const [createTeam , setCreateTeam] = useState<z.infer<typeof CreateTeamSchema>>(
          {
               name: "",
               description: "",
               team_leader_id: 1,
               members_limit: 10,
          }
     );

     function handle_submit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault();
          const result = CreateTeamSchema.safeParse(createTeam);
          if (!result.success) {
               toast.error("Invalid form data");
               return;
          }
          const createTeamResponse = postRequests({
               url: "team/",
               token: token as string,
               data: createTeam,
          });
          if (createTeamResponse) {
               toast.success("Team created successfully");
          }
     }

     if (user?.is_superuser === false) {
       return <div></div>;
     }
     
     const {data:users , isLoading:usersLoading} = useQuery({
           queryKey: ["users"],
           queryFn: async () => {
           const response = await getRequests({
                url: "user/",
                token: token as string,
           });
           if (response) {
                const data = await response;
                return data as UserType[];
           }
           toast.error("Failed to fetch users");
           },
     });

     
     const { data, isLoading } = useQuery({
          queryKey: ["teams"],
          queryFn: async () => {
               const response = await getRequests({
                    url: "team/",
                    token: token as string,
               });
               if (response) {
                    const data = await response;
                    console.log(data , "data teams");
                    setTeams(data);
                    return data;
               }
               toast.error("Failed to fetch teams");
          },
     });
    
     return (
          <div className="flex flex-row w-full justify-start items-start gap-2 text-white p-2 rounded-md">
            <form onSubmit={handle_submit} method="POST"  className="flex flex-col bg-mainColor p-2 rounded-md">
              <h1>Create Team</h1>
              <Input placeholder="Team Name" className="my-5" 
                 onChange={(e) => {
                    setCreateTeam((prev) => ({ ...prev, name: e.target.value }));
                     }}
              />
              <Textarea placeholder="Team Description" className="my-5" 
                    onChange={(e) => {
                    setCreateTeam((prev) => ({ ...prev, description: e.target.value }));
                    }}
              />
              <Select 
                    onValueChange={(e) => {
                    setCreateTeam((prev) => ({ ...prev, team_leader_id: parseInt(e) }));
                    }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <Input placeholder="Search Team Leader" className="my-5" />
                  <SelectGroup>
                    {usersLoading ? (
                      <p>Loading...</p>
                    ) : (
                      users?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
                 <Input 
                 placeholder="Members Limit" 
                 className="my-5"
                 value = {createTeam.members_limit}
                 type = "number" 
                         onChange={(e) => {
                         setCreateTeam((prev) => ({ ...prev, members_limit: parseInt(e.target.value) }));
                         }}
                     />
              <Button className="my-4">Submit</Button>
            </form>
            <div className="flex flex-col border border-mainColor p-2 rounded-md min-w-[200px] max-h-[500px] overflow-y-auto">
              <h1 style={{ textDecoration: "underline" }}> All Teams </h1>
              <div className="flex flex-col gap-2">
                {data ? (
                  teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex flex-col justify-between items-start gap-5 bg-mainColor p-2 rounded-md my-2"
                    >
                      <div className="flex flex-row align-center gap-2 justify-center">
                        <span className="font-bold text-green-500">{team.name}</span>
                        with
                        <Badge>{team.team_leader.name}</Badge>
                      </div>
      
                      <ScrollArea className="flex flex-col gap-2 w-full">
                        {team.team_members.map((member) => (
                          <div key={member.id} className="flex flex-row gap-2">
                            <Badge>{member.email}</Badge>{" "}
                            <X className="cursor-pointer" />
                          </div>
                        ))}
                      </ScrollArea>
      
                      <div className="flex flex-row gap-4">
                        <Button className="bg-red-500 text-white p-5 hover:text-red-500">
                          Delete Team
                        </Button>
                        <Button className="bg-blue-500 text-white p-5 hover:text-blue-500">
                          Add Member
                        </Button>
                      </div>
                    </div>
                  ))
                ) : isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <p>No Teams</p>
                )}
              </div>
            </div>
          </div>
        );
}