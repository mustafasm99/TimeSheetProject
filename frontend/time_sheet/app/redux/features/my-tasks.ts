import { createSlice } from '@reduxjs/toolkit';
import { FullTask } from '@/types/pages';

type taskManagerState = {
     tasks?:FullTask[];
}

const initialState:taskManagerState = {
     tasks: []
}

const tasksSlice = createSlice({
     name: 'my-tasks',
     initialState,
     reducers:{
          addTask: (state, action:{payload:FullTask}) => {
               state.tasks?.push(action.payload);
          },
          setTasks: (state, action:{payload:FullTask[]}) => {
               state.tasks = action.payload;
          },
          removeTask: (state, action:{payload:number}) => {
               state.tasks?.filter((task) => task.task.id !== action.payload);
          }
     }
})

export default tasksSlice.reducer;
export const {addTask, setTasks, removeTask} = tasksSlice.actions;