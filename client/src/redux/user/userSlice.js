
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser : null,
    error : null,
    loading : false,
}


const userSlice = createSlice({
    name : "user",
    initialState,
    reducers:{
        signInStart : (state) => {
            state.loading = true;
        },
        signInSuccess : (state,action) => {
            state.currentUser = state.currentUser = {
                ...action.payload,
                avatar: action.payload.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_Op4Qn7cM-RkGM2MFM0EmODTGSEBCG7ehA6K7AB0Ak6-SmgpMFhQYpQuHjhOddSQlJw&usqp=CAU.png",
            };
            state.loading = false;
            state.error = null;
            
        },
        signInFailure : (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setAvatar: (state, action) => {
        if (state.currentUser) {
            state.currentUser.avatar = action.payload;
        }},
        updateUserStart:(state) =>{
            state.loading = true;
        },
        updateUserSuccess:(state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure:(state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
            },

        deleteUserStart: (state) => {
            state.loading=true;
        },
        deleteUserSuccess: (state) =>{
            state.currentUser = null;
            state.loading=false;
            state.error = null;
        },
        deleteUserFailure: (state,action) =>{
            state.loading=false;
            state.error = action.paylaod;
        },
        signoutUserStart: (state) => {
            state.loading=true;
        },
        signoutUserSuccess: (state) =>{
            state.currentUser = null;
            state.loading=false;
            state.error = null;
        },
        signoutUserFailure: (state,action) =>{
            state.loading=false;
            state.error = action.paylaod;
        }
}});

export const {signInStart,signInSuccess,setCurrentUser,signInFailure,updateUserSuccess,updateUserFailure,updateUserStart,setAvatar,clearError,deleteUserStart,deleteUserFailure,deleteUserSuccess,
    signoutUserStart,signoutUserSuccess,signoutUserFailure} = userSlice.actions;

export default userSlice.reducer;