import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const createProject = createAsyncThunk(
    'project/createProject',
    async({project,token},thunkAPI)=>{
        const {projectName, projectType,projectTypeOther,description,inviteEmails} = project
        try{

            const response = await clientServer.post('/api/project',{projectName,projectType,projectTypeOther,description,inviteEmails},{
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


export const joinProject = createAsyncThunk(
    'project/joinProject',
    async({inviteCode,role,roleOther,token},thunkAPI)=>{
        try{
        const response = await clientServer.post('/api/project/join',{inviteCode,role,roleOther},{
              headers : {
                Authorization : `Bearer ${token}`
              }
        });
        return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
    }
});


// getMyProject

export const getMyProject = createAsyncThunk(
    'project/getMyProject',
    async(token,thunkAPI)=>{
        try{
        const response = await clientServer.get('/api/project/mine',{
              headers : {
                Authorization : `Bearer ${token}`
              }
        });
            return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
    }
});


 


export const getProjectById = createAsyncThunk(
    'project/getProjectById',
    async({projectId,token},thunkAPI)=>{
        try{
        const response = await clientServer.get(`/api/project/${projectId}`,{
              headers : {
                Authorization : `Bearer ${token}`
              }
        });
        return response.data;
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
    }
});
//delete