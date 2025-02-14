
import { TeamType } from '@/types/team';
import { ProjectType } from '@/types/projects';
import { UserType } from '@/types/user';

export type AdminSite = {
     teams: TeamType[],
     projects: ProjectType[],
     users: UserType[],
     project_statuses: project_statuses[],
};

type project_statuses = {
     description : string,
     id: number,
     title : string,
}