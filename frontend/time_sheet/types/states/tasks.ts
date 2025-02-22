export type TaskType = {
     id:number;
     create_time:string;
     update_time:string;
     is_active:boolean;
     start_time:string;
     end_time:string;
     description:string;
     status_id:number;
     category_id:number;
     project_id:number;
     title:string;
     assignees?:TaskAssignee[];
     task_category?:TaskCategory;
     task_status?:TaskStatus;
     task_counters?:TaskCounter[];
     task_accountable?:TaskAccountable[];
     
}
export type TaskAssignee = {
     user_id:number;
     task_id:number;
     is_active:boolean;
     create_time:string;
     update_time:string;
}
export type TaskStatus = {
     id:number;
     status:string;
     is_active:boolean;
     update_time:string;
     create_time:string;
}
export type TaskAccountable = {
     task_id:number;
     accountable_id:number;
     is_active:boolean;
     create_time:string;
     update_time:string;
}
export type TaskCategory = {
     id:number;
     category:string;
     is_active:boolean;
     create_time:string;
     update_time:string;
}

export type TaskCounter = {
     task_id:number;
     user_id:number;
     start_time:string;
     end_time:string;
     notes:string;
     counter_type_id:number;
}
export type TaskCounterType = {
     id:number;
     counter_type:string;
     is_active:boolean;
     create_time:string;
     update_time:string;
}