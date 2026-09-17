import { createSlice } from "@reduxjs/toolkit"
import { getTasksByProject, updateTask } from "../../action/taskAction"


const initialState = {
    tasks : [],
    isError : false,
    isSuccess : false,
    isLoading : false,
    updatingTaskId: null,
    message : '',
 
    
}



const taskSlice = createSlice({
    name : 'task',
    initialState, 
    reducers : {
      
    reset :  (state)=> {
    state.tasks = [];
    state.isError = false;
    state.isSuccess = false;
    state.isLoading = false;
    state.message =   '' ;
    
    } ,
    clearMessage : (state)=>{
        state.message = '';
    } 
  },
    extraReducers : (builder)=>{
        builder
    .addCase(getTasksByProject.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Fetching tasks...";
    })
      .addCase(getTasksByProject.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tasks = action.payload.tasks;
        state.message = "";
    })
    .addCase(getTasksByProject.rejected,(state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message;
    })
    .addCase(updateTask.pending,(state,action)=>{
        state.updatingTaskId = action.meta.arg.taskId;
        state.isLoading = true;
        state.message = "Updating Task...";
    })
    .addCase(updateTask.fulfilled,(state,action)=>{
          state.updatingTaskId = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const updatedTask = action.payload.updatedTask;
       const idx = state.tasks.findIndex( t => t._id === updatedTask._id);
       if (idx !== -1) {
        state.tasks[idx] = updatedTask;
       }
      state.message = "Task updated successfully.";
    })
    .addCase(updateTask.rejected, (state,action)=>{
          state.updatingTaskId = null;
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message ;
    })
    
    }

})

export  const {reset, clearMessage} = taskSlice.actions

export default taskSlice.reducer


