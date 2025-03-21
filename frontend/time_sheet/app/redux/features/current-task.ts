import { createSlice, current } from '@reduxjs/toolkit';
import { FullTask } from '@/types/pages';

const initialState: FullTask & { currentCounter: number } = {
    task: {
        title: '',
        description: '',
        assignee: [],
        start_time: new Date().toISOString(), // Store as string
        end_time: new Date().toISOString(),  // Store as string
        status_id: 0,
        category_id: 0,
        project_id: 0,
        id: 0,
        is_counting: false,
        work_time: 0
    },
    task_status: {
        id: 0,
        status: '',
        is_active: false,
        create_time: "",
        update_time: "",
    },
    task_assignees: [],
    currentCounter: 0
};

const currentTaskSlice = createSlice({
    name: 'current-task',
    initialState,
    reducers: {
        setTask: (state, action: { payload: FullTask }) => {
            console.log(action.payload , "current task has been set");
            state.task = {
                ...action.payload.task,
                start_time: action.payload.task.start_time 
                    ? new Date(action.payload.task.start_time).toISOString() 
                    : new Date().toISOString(),
                end_time: action.payload.task.end_time 
                    ? new Date(action.payload.task.end_time).toISOString() 
                    : new Date().toISOString(),
            };
            state.task_status = action.payload.task_status;
            state.task_assignees = action.payload.task_assignees || [];
            state.currentCounter = action.payload.task.work_time || 0;
        },
        setStatus: (state, action) => {
            state.task_status = action.payload;
        },
        setAssignees: (state, action) => {
            state.task_assignees = action.payload;
        },
        reset: (state) => {
            state.task = initialState.task;
            state.task_status = initialState.task_status;
            state.task_assignees = initialState.task_assignees;
        },
        startCounting: (state) => {
            state.task.is_counting = true;
        },
        stopeCounting: (state) => {
            state.task.is_counting = false;
        },
        setCounterTime: (state, action: { payload: number }) => {
            state.currentCounter = action.payload;
        },
        incrementCounter: (state, action: { payload: (prev: number) => number }) => {
            state.currentCounter = action.payload(state.currentCounter);
        },
        clearTask: (state) => {
            state.task = initialState.task;
            state.task_status = initialState.task_status;
            state.task_assignees = initialState.task_assignees;
            state.currentCounter = initialState.currentCounter;
        }
    }
});

export const { 
    setTask, 
    setStatus, 
    setAssignees, 
    reset, 
    startCounting, 
    stopeCounting, 
    setCounterTime, 
    incrementCounter,
    clearTask,
} = currentTaskSlice.actions;

export default currentTaskSlice.reducer;
