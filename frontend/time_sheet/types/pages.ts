import { profileMe } from "./profile_type";
import { ProjectType } from "./projects";
import { TaskStatus } from "./states/tasks";
import { TaskType } from "./tasks";
import { TeamType } from "./team";
import { UserType } from "./user";

export type FullUserType = {
     user: UserType;
     profile: profileMe;
     image_url: string;
}

export type ProjectBoxType = {
     project: ProjectType;
     team_members:FullUserType[];
     team:TeamType;
}

export type FullTask = {
     task:TaskType;
     task_status:TaskStatus;
}

export type UserDashboardTypeResponse = {
     current_project?: ProjectBoxType;
     my_tasks?:FullTask[];
}

export type ProjectPageResponse = {
     projects:{
          project:ProjectType;
          team_members:FullUserType[];
          team:TeamType;
     },
     task_status:TaskStatus[];
     tasks:FullTask[];
}