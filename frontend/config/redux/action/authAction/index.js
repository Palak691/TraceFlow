import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const register = createAsyncThunk(
    'user/register',
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post('/api/user/register',{
                 name : user.name,
                 email : user.email,
                 password : user.password,  
            });
            console.log(response.data);
            return response.data;
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
        }
    }
)


export const login = createAsyncThunk(
    'user/login',
    async(user,thunkAPI)=>{
        try{
        const response = await clientServer.post('/api/user/login',{
            email : user.email,
            password : user.password
        });
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
            return response.data
        }else{
            return thunkAPI.rejectWithValue({message : "Token not provided!"})
        }
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data || {message : err.message})
    }
})

export const uploadProfilePicture = createAsyncThunk(
    'user/uploadProfilePicture',
    async({token, profilePicture},thunkAPI)=>{
        const formData = new FormData();
        formData.append('profilePicture',profilePicture)
        try{
            const response = await clientServer.post('/api/user/profile-picture', formData, {
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

export const getUserProfileData = createAsyncThunk(
    '/user/getUserProfileData',
   async (token, thunkAPI)=>{
    try{
      const response =  await clientServer.get('api/user/me',{
      headers : {
        Authorization : `Bearer ${token}`
      }
      });
      return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data || {message : err.message});
    }
}
)




export const updateUserProfileData = createAsyncThunk(
  '/user/updateUserProfileData',
  async ({ token, data }, thunkAPI) => {
    try {
      const response = await clientServer.patch('/api/user/me', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);