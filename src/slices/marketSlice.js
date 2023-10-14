import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    market: []
}

export const stakingSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setMarket: (state, action) => {
            state.market = action.payload
        },
    }
})
 
export const { setMarket } = stakingSlice.actions

export default stakingSlice.reducer