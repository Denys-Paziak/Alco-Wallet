import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    USDBalance: 0,
    cryptoBalance: {}
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUSDBalance: (state, action) => {
            state.USDBalance = action.payload
        },

        setCryptoBalance: (state, action) => {
            state.cryptoBalance = action.payload
        },
    }
})

export const { setUSDBalance, setCryptoBalance } = userSlice.actions

export default userSlice.reducer