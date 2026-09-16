import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDecisionsByProject  = createAsyncThunk(
      "decision/getByProject",
    async({token,projectId},thunkAPI)=>{
        try{
            const response = await clientServer.get(`/api/decision/${projectId}`,{
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
