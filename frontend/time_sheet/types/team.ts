import { UserType } from './user';

export type TeamType = {
     id: number;
     name: string;
     description: string;
     team_leader: UserType;
     team_members: UserType[];
}