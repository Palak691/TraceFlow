import { createSlice } from "@reduxjs/toolkit"
import { createConversation, createConversationFromImage, getConversationsByProject } from "../../action/conversationAction";

const initialState = {
    conversations : [],
    isError : false,
    isSuccess : false,
    isLoading : false,
    message : ''
    
}



const conversationSlice = createSlice({
    name : 'conversation',
    initialState, 
    reducers : {
      
    reset :  (state)=> {
      state.conversations = [],
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message =   '';
    } ,
    clearMessage : (state)=>{
        state.message = ''
    } 
  },
    extraReducers : (builder)=>{
        builder
    .addCase(createConversation.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Fetchingg con...";
    })
      .addCase(createConversation.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
         state.conversations.unshift(action.payload.conversation);
        // newest conversation to show up
        state.message = "Conversation processed"
    })
    .addCase(createConversation.rejected,(state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message;
    })
    .addCase(getConversationsByProject.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Fetching Conversations...";
    })
    .addCase(getConversationsByProject.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.conversations = action.payload?.conversations;
        state.message = "Fetched Conversations successfully";
    })
    .addCase(getConversationsByProject.rejected, (state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message ;
    })
     .addCase(createConversationFromImage.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Processing...";
    })
    .addCase(createConversationFromImage.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
      if (action.payload?.conversation) {
        state.conversations.unshift(action.payload.conversation);
        }
        state.message = "Image processed"; 
    })
    .addCase(createConversationFromImage.rejected, (state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message ;
    })
    
    }

})

export  const {reset, clearMessage} = conversationSlice.actions

export default conversationSlice.reducer