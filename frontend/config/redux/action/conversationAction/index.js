import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createConversation = createAsyncThunk(
    'conversation/create',
    async({projectId,token,source, rawText},thunkAPI)=>{
        try{
            const response = await clientServer.post('/api/conversation',{projectId,source,rawText},{
              headers : {
                Authorization : `Bearer ${token}`
              }
            });
            return response.data;
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
        }
    }
)

export const getConversationsByProject = createAsyncThunk(
  "conversation/getByProject",
  async ({ token, projectId },thunkAPI) => {
     try{
            const response = await clientServer.get(`/api/conversation/${projectId}`,{
              headers : {
                Authorization : `Bearer ${token}`
              }
            });
            return response.data;
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
        }
  }
);

export const createConversationFromImage = createAsyncThunk(
  "conversation/createConversationFromImage",
  async ({ token, formData },thunkAPI) => {
     try{
            const response = await clientServer.post(`/api/conversation/upload`,formData,{
              headers : {
                Authorization : `Bearer ${token}`
              }
            });
            return response.data;
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
        }
  }
);




