import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const searchProject = createAsyncThunk(
     "search/searchProject",
    async({token,projectId,q},thunkAPI)=>{
        try{
            const response = await clientServer.get(`/api/search/${projectId}`, {params: { q, projectId},
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







