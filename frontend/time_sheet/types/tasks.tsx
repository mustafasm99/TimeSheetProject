import {z} from 'zod';

export const TaskAssignee = z.object({
     assignee_names: z.array(z.string()).nullish(),
})


export const Task = z.object({
     task_title: z.string(),
     task_description: z.string(),
     assignee: TaskAssignee,
     due_date: z.date(),
     status: z.string(),
     priority: z.string(),
     project: z.string(),
})

export type TaskType = z.infer<typeof Task>