import { createSlice } from "@reduxjs/toolkit"
import { getDecisionsByProject } from "../../action/decisionAction"


const initialState = {
    decisions : [],
    isError : false,
    isSuccess : false,
    isLoading : false,
    message : '',

}



const decisionSlice = createSlice({
    name : 'decision',
    initialState, 
    reducers : {
      
    reset :  (state)=> {
     state.decisions = [];
    state.isError = false;
    state.isSuccess = false;
    state.isLoading = false;
    state.message = '';
    } ,
    

    clearMessage : (state)=>{
        state.message = ''
    } 
  },
    extraReducers : (builder)=>{
        builder
    .addCase(getDecisionsByProject.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Fetchingg decisions...";
    })
      .addCase(getDecisionsByProject.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.decisions = action.payload?.decisions || [];
        state.message = "Fetched Decisions sucessfully";
    })
    .addCase(getDecisionsByProject.rejected,(state,action)=>{
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload?.message || 'Failed to Fetch decisions';
    })
 
    }
})

export  const {reset, clearMessage} = decisionSlice.actions

export default decisionSlice.reducer