import {createSlice } from '@reduxjs/toolkit';
import { AdminSite } from '@/types/states/admin';

const initialState:AdminSite = {
     teams: [],
     projects: [],
     users: [],
}

export const adminSlice = createSlice({
     name: 'admin-site',
     initialState,
     reducers: {
          setTeams: (state, action) => {
               state.teams = action.payload;
          },
          setProjects: (state, action) => {
               state.projects = action.payload;
          },
          setUsers: (state, action) => {
               state.users = action.payload;
          },
          setState: (state, action) => {
               state.teams = action.payload.teams;
               state.projects = action.payload.projects;
               state.users = action.payload.users;
          }

     }
});

export const { setTeams, setProjects, setUsers ,setState } = adminSlice.actions;
export default adminSlice.reducer;