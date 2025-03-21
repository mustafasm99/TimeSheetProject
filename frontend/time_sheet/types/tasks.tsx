import {z} from 'zod';
import { TaskStatus } from './states/tasks';
import { FullTask, FullUserType } from './pages';

export const TaskAssignee = z.object({
     assignee: z.array(z.number()).nullish(),
})


export const Task = z.object({
     title: z.string(),
     description: z.string(),
     assignee: z.array(z.number()),
     start_time: z.date().or(z.string()),
     end_time: z.date().or(z.string()),
     status_id: z.number(),
     category_id: z.number(),
     project_id: z.number(),
})

export type TaskType = z.infer<typeof Task> & {id?: number , is_counting?:boolean , work_time?:number};
export type TaskCounter = {
     id: number;
     task_id: number;
     start_time: string;
     end_time: string;
     notes: string;
     is_counting: boolean;
     counter_type_id: number;

}

export type TaskPageResponse = {
     task:TaskType;
     task_status:TaskStatus;
     task_assignees?:FullUserType[];
     total_counter_time: number;
     current_counter_time: TaskCounter;
}