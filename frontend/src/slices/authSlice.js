import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    signupDate:null,
    loading:false,
    token:localStorage.getItem('toekn')?JSON.parse(localStorage.getItem('token')):null
}

const authSlice = createSlice({
    name:"auth",
    initialState ,
    reducers:{
        setSignupDate(state,value){
            state.signupDate = value.payload
        },
        setLoading(state,value){
            state.loading = value.payload
        },
        settoken(state,value){
            state.token = value.payload
        }
    }
})

export const {setSignupDate,setLoading,settoken}  = authSlice.actions;
export default authSlice.reducer