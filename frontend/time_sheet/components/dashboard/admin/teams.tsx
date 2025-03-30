import { useAppContext } from "@/context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postRequests } from "@/server/base/base_requests";
import { TeamType } from "@/types/team";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../../ui/scroll-area";
import { X } from "lucide-react";
import { z } from "zod";
import { UserType } from "@/types/user";
import { Value } from "@radix-ui/react-select";
import { useAppSelector } from "@/app/redux/store";
import { AdminSite } from "@/types/states/admin";


const CreateTeamSchema = z.object({
  name: z.string(),
  description: z.string(),
  team_leader_id: z.number(),
  members_limit: z.number(),
});

export default function TeamsManagement() {
  const { user, token } = useAppContext();
  const [createTeam, setCreateTeam] = useState<
    z.infer<typeof CreateTeamSchema>
  >({
    name: "",
    description: "",
    team_leader_id: 1,
    members_limit: 10,
  });
  const adminData  = useAppSelector((state) => state.AdminStore);
  console.log(adminData , "From Redux State ")
  async function handle_submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = CreateTeamSchema.safeParse(createTeam);
    if (!result.success) {
      toast.error("Invalid form data");
      return;
    }
    const createTeamResponse = await postRequests({
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

  
  if(adminData)
  return (
    <div className="min-w-fit h-fit p-5 bg-[#aaaaaa] rounded-xl">
      <div className="flex flex-row w-full justify-start items-start gap-2 text-white p-2 rounded-md">
        <form
          onSubmit={handle_submit}
          method="POST"
          className="flex flex-col bg-mainColor p-2 rounded-md"
        >
          <h1>Create Team</h1>
          <Input
            placeholder="Team Name"
            className="my-5"
            onChange={(e) => {
              setCreateTeam((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <Textarea
            placeholder="Team Description"
            className="my-5"
            onChange={(e) => {
              setCreateTeam((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          />
          <Select
            onValueChange={(e) => {
              setCreateTeam((prev) => ({
                ...prev,
                team_leader_id: parseInt(e),
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Team Leader" />
            </SelectTrigger>
            <SelectContent>
              <Input placeholder="Search Team Leader" className="my-5" />
              <SelectGroup>
                 {(
                  adminData.users
                  ?.filter((user)=> user.id !== undefined)
                  ?.map((user) => (
                    <SelectItem key={user.id} value={
                      user.id === undefined ? "": user.id.toString()
                    }>
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
            value={createTeam.members_limit}
            type="number"
            onChange={(e) => {
              setCreateTeam((prev) => ({
                ...prev,
                members_limit: parseInt(e.target.value),
              }));
            }}
          />
          <Button className="my-4">Submit</Button>
        </form>
        <div className="flex flex-col border border-mainColor p-2 rounded-md min-w-[200px] max-h-[500px] overflow-y-auto">
          <h1 style={{ textDecoration: "underline" }}> All Teams </h1>
          <div className="flex flex-col gap-2">
            {adminData.teams ? (
              adminData.teams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col justify-between items-start gap-5 bg-mainColor p-2 rounded-md my-2"
                >
                  <div className="flex flex-row align-center gap-2 justify-center">
                    <span className="font-bold text-green-500">
                      {team.name}
                    </span>
                    with
                    <Badge>{team.team_leader.name}</Badge>
                  </div>

                  <ScrollArea className="flex flex-col gap-4 w-full max-h-[220px] overflow-auto">
                    {team.team_members.map((member) => (
                      <div key={member.id} className="flex flex-row gap-2 my-2">
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
            ): (
              <p>No Teams</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
