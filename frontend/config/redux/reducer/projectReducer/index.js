import { createSlice } from "@reduxjs/toolkit"
import { createProject, getMyProject, getProjectById, joinProject } from "../../action/projectAction";


const initialState = {
  projects: [],
  currentProject: null,
  memberDetails : [],
  allMembers : [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const projectSlice = createSlice({
    name : 'project',
    initialState, 
    reducers : {
      
    reset :  (state)=> {
     state.projects = [];
     state.currentProject = null;
     state.memberDetails =[];
     state.allMembers = [];
     state.isError  = false;
     state.isSuccess = false;
     state.isLoading = false;
     state.message = "";
    } ,
    

    clearMessage : (state)=>{
        state.message = ''
    } 
  },
    extraReducers : (builder)=>{
        builder
    .addCase(createProject.pending,(state,action)=>{
        state.isLoading = true;
        state.isError = false;
        state.message = "Creating project...";
    })
      .addCase(createProject.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.currentProject = action.payload.project;
         state.projects.push(action.payload.project)
        state.message = "Project created successfully";
    })
    .addCase(createProject.rejected,(state,action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to create project";
    })
   .addCase(joinProject.pending, (state) => {
       state.isLoading = true;
       state.isError = false;
       state.message = "Joining project...";
    })
   .addCase(joinProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.currentProject = action.payload.project;
      state.projects.push(action.payload.project);
      state.message = "Project joined successfully";
    })
  .addCase(joinProject.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message =
      action.payload?.message || "Failed to join project";
    })
   .addCase(getProjectById.pending, (state) => {
     state.isLoading = true;
     state.isError = false;
     state.message = "Loading project...";
    })
   .addCase(getProjectById.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isError = false;
    state.isSuccess = true;
    state.currentProject = action.payload.project;
    state.message = "";
    })
  .addCase(getProjectById.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message =
    action.payload?.message || "Failed to load project";
  })
  .addCase(getMyProject.pending, (state) => {
     state.isLoading = true;
     state.isError = false;
     state.message = "Loading project...";
    }) 
    .addCase(getMyProject.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isError = false;
    state.isSuccess = true;
    state.message = "";
    state.projects = action.payload.projects
    })
  .addCase(getMyProject.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message =
    action.payload?.message || "Failed";
  })
}
})

export  const {reset, clearMessage} = projectSlice.actions

export default projectSlice.reducer