import {createSlice } from '@reduxjs/toolkit';
import { AdminSite } from '@/types/states/admin';
import { UserType } from '@/types/user';

const initialState:AdminSite = {
     teams: [],
     projects: [],
     users: [],
     project_statuses: []
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
               state.project_statuses = action.payload.project_statuses;
          },
          add_project: (state, action) => {
               state.projects.push(action.payload);
          },
          add_team: (state, action) => {
               state.teams.push(action.payload);
          },
          add_user: (state, action:{payload:UserType}) => {
               state.users = [...state.users , action.payload];
          },
          add_project_status: (state, action) => {
               state.project_statuses.push(action.payload);
          },
          remove_project: (state, action) => {
               state.projects = state.projects.filter((project) => project.id !== action.payload);
          },
          remove_team: (state, action) => {
               state.teams = state.teams.filter((team) => team.id !== action.payload);
          },
          remove_user: (state, action) => {
               state.users = state.users.filter((user) => user.id !== action.payload);
          },
          remove_project_status: (state, action) => {
               state.project_statuses = state.project_statuses.filter((status) => status.id !== action.payload);
          }


     }
});

export const { 
      setTeams,
      setProjects,
      setUsers, 
      setState, 
      add_project , 
      add_project_status , 
      add_team , 
      add_user,
      remove_project,
      remove_project_status,
      remove_team,
      remove_user

     } = adminSlice.actions;
export default adminSlice.reducer;