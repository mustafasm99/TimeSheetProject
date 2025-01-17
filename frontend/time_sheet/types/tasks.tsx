import {z} from 'zod';

export const TaskAssignee = z.object({
     assignee: z.array(z.number()).nullish(),
})


export const Task = z.object({
     title: z.string(),
     description: z.string(),
     assignee: z.array(z.number()),
     start_time: z.date(),
     end_time: z.date(),
     status_id: z.number(),
     category_id: z.number(),
     project_id: z.number(),
})

export type TaskType = z.infer<typeof Task>