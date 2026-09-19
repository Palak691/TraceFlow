import { createSlice } from "@reduxjs/toolkit"
import { getUserProfileData, login ,register, updateUserProfileData, uploadProfilePicture } from "../../action/authAction";

const initialState = {
    username : null,
    user: '',
    token: null,
    userId:null,
    isError : false,
    isSuccess : false,
    isLoading : false,
    isLoggedIn : false,
    message : '',
    profileFetced : false,
    userProfile : {},
    userProjects : [],
    showMessage : '',
    allUsers : [],
    adminUser : null,
}



const authSlice = createSlice({
    name : 'auth',
    initialState, 
    reducers : {
      
    reset :  (state)=> {
    state.username = null;
    state.token = null;
    state.isError = false;
    state.isSuccess = false;
    state.isLoading = false;
    state.isLoggedIn = false;
    state.message = '';
    state.profileFetced = false;
    state.userProfile = {};
    state.userProjects = [];
    state.showMessage = '';
    state.allUsers = [];
    state.adminUser = null;
    } ,
    
    handleLoginUser :(state)=>{
        state.message = 'Hello'
    },

    clearMessage : (state)=>{
        state.message = ''
    } 
  },
    extraReducers : (builder)=>{
        builder
    .addCase(register.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Registering...";
    })
      .addCase(register.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.username = action.payload?.user?.name;
        state.message = "Registered Successfully";
    })
    .addCase(register.rejected,(state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message || 'Registration failed! ';
    })
    .addCase(login.pending,(state,action)=>{
        state.isLoading = true;
        state.message = "Logging in..";
    })
    .addCase(login.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isLoggedIn = true;
        state.username = action.payload.user?.name;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.message = "Logged in Successfully.";
    })
    .addCase(login.rejected, (state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message || "Login Failed!";
    })
    .addCase(getUserProfileData.pending,(state,action)=>{
         state.isLoading = true;
         state.message = "Loggin...";
    })
    .addCase(getUserProfileData.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true
        state.isLoggedIn = true;
        state.userProfile = action.payload?.user;
        state.userProjects = action.payload?.projects
        state.message = "UserProfile Fetched Successfully.";
    })
    .addCase(getUserProfileData.rejected, (state,action)=>{
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload?.message || "Something went wrong!";
    })
    .addCase(uploadProfilePicture.pending, (state) => {
    state.isLoading = true;
    })
    .addCase(uploadProfilePicture.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isError = false;
    state.userProfile = { ...state.userProfile, ...action.payload.profilePicture };
    state.message = "Profile picture updated.";
   })
   .addCase(uploadProfilePicture.rejected, (state, action) => {
    state.isError = true;
    state.isLoading = false;
    state.message = action.payload?.message || "Failed to upload picture.";
    })
   .addCase(updateUserProfileData.pending, (state) => {
    state.isLoading = true;
     })
   .addCase(updateUserProfileData.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isError = false;
    state.userProfile = { ...state.userProfile, ...action.payload.user };
    state.message = "Profile updated.";
    })
   .addCase(updateUserProfileData.rejected, (state, action) => {
    state.isError = true;
    state.isLoading = false;
    state.message = action.payload?.message || "Failed to update profile.";
   })
    }

})

export  const {reset, clearMessage} = authSlice.actions

export default authSlice.reducer