import { createSlice } from "@reduxjs/toolkit";

const initialState  ={
    user:null
}


const ProfileSlicer = createSlice({
    name:"profile",
    initialState ,
    reducers:{
        setUser:(state,value)=>{
            state.user = value.payload
        }
    }
})

export const {setUser} = ProfileSlicer.actions

export default ProfileSlicer.reducer