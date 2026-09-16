import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTasksByProject = createAsyncThunk(
     "task/getByProject",
    async({token,projectId},thunkAPI)=>{
        try{
            const response = await clientServer.get(`/api/task/${projectId}`,{
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

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ token, taskId,updateTasks },thunkAPI) => {
    try{
            const response = await clientServer.patch(`/api/task/${taskId}`,updateTasks,{
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
