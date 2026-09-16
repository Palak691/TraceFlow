import { createSlice } from "@reduxjs/toolkit"
import { getTasksByProject, updateTask } from "../../action/taskAction"


const initialState = {
    tasks : [],
    isError : false,
    isSuccess : false,
    isLoading : false,
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
        state.isLoading = true;
        state.message = "Updating Task...";
    })
    .addCase(updateTask.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        const idx = state.tasks.findIndex(t => t._id === action.payload.task._id);
                if (idx !== -1) state.tasks[idx] = action.payload.task;
        state.message = "updated task Successfully.";
    })
    .addCase(updateTask.rejected, (state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message ;
    })
    
    }

})

export  const {reset, clearMessage} = taskSlice.actions

export default taskSlice.reducer



// 1. state.tasks is your array of all tasks currently in Redux state
//  (e.g. [task1, task2, task3, ...])
// 2. .findIndex(t => t._id === action.payload.task._id) 
// — loops through that array looking for the task
//  whose _id matches the ID of the task that just got updated. 
// . findIndex returns the position (a number like 0, 1, 2...)
//  where it found a match, or -1 if nothing matched
// 3. if (idx !== -1) — safety check: only proceed if we actually
//  found it in the array (it should always be there,
//  but this guards against a weird edge case where it's somehow missing)
// 4. state.tasks[idx] = action.payload.task —
//  replaces the old (stale) task object at that position with the fresh one the server just returned