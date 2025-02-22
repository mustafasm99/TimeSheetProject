import {createSlice } from '@reduxjs/toolkit';
import {TaskCategory, TaskStatus, TaskType} from '@/types/states/tasks';

type taskManagerState = {
     tasks?:TaskType[];
     task_categories?:TaskCategory[];
     task_statuses?:TaskStatus[];

}

const initialState:taskManagerState = {
     tasks: [],
     task_categories: [],
     task_statuses: []
}

const tasksSlice = createSlice({
     name: 'tasks',
     initialState,
     reducers: {
          setTasks: (state, action) => {
               state.tasks = action.payload;
          },
          addTask: (state, action) => {
               state.tasks?.push(action.payload);
          },
          updateTask: (state, action) => {
               const index = state.tasks?.findIndex((task) => task.id === action.payload.id);
               if(index && index > -1){
                    state.tasks?.splice(index, 1, action.payload);
               }
          },
          removeTask: (state, action) => {
               state.tasks?.filter((task) => task.id !== action.payload);
          },
          setCategories: (state, action) => {
               state.task_categories = action.payload;
          },
          addCategory: (state, action) => {
               state.task_categories?.push(action.payload);
          },
          updateCategory: (state, action) => {
               const index = state.task_categories?.findIndex((category) => category.id === action.payload.id);
               if(index && index > -1){
                    state.task_categories?.splice(index, 1, action.payload);
               }
          },
          removeCategory: (state, action) => {
               state.task_categories?.filter((category) => category.id !== action.payload);
          },
          setTaskStatuses: (state, action) => {
               state.task_statuses = action.payload;
          },
          addTaskStatus: (state, action) => {
               state.task_statuses?.push(action.payload);
          },
          updateTaskStatus: (state, action) => {
               const index = state.task_statuses?.findIndex((status) => status.id === action.payload.id);
               if(index && index > -1){
                    state.task_statuses?.splice(index, 1, action.payload);
               }
          },
          removeTaskStatus: (state, action) => {
               console.log(action.payload);
               state.task_statuses?.filter((status) => {
                    console.log(status.id , status);
                    return status.id !== action.payload;
               });
          },
     }
});

export default tasksSlice.reducer;
export const { 
     setTasks, 
     addTask, 
     updateTask, 
     removeTask,
     setCategories,
     addCategory,
     updateCategory,
     removeCategory,
     setTaskStatuses,
     addTaskStatus,
     updateTaskStatus,
     removeTaskStatus
} = tasksSlice.actions;