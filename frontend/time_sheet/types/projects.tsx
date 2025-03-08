export interface ProjectType {
     description: string;
     update_time: string;
     team_id: number;
     start_time: string;
     end_time: string;
     members_counter: number | null;
     team_leader_id: number;
     project_manager_id: number;
     name: string | null;
     id: number;
     create_time: string;
     is_active: boolean;
     members_limit: number;
     is_completed: boolean;
     project_status_id: number;
}