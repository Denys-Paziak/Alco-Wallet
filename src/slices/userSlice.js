import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    USDBalance: 0,
    cryptoBalance: {},
    TRDBalance: 0,
    staking: {}
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
        setTRDBalance: (state, action) => {
            state.TRDBalance = action.payload
        },
        setUserStaking: (state, action) => {
            state.staking = action.payload
        }
    }
})

export const { setUSDBalance, setCryptoBalance, setTRDBalance, setUserStaking } = userSlice.actions

export default userSlice.reducer