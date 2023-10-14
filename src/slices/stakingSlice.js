import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    staking: []
}

export const stakingSlice = createSlice({
    name: 'staking',
    initialState,
    reducers: {
        setStaking: (state, action) => {
            state.staking = action.payload
        },
    }
})
 
export const { setStaking } = stakingSlice.actions

export default stakingSlice.reducer