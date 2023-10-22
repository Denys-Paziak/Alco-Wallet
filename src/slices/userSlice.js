import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    USDBalance: 'load',
    cryptoBalance: 'load',
    TRDBalance: 'load',
    staking: 'load',
    deposit: 'load'
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
        },
        setUserDeposit: (state, action) => {
            state.deposit = action.payload
        }
    }
})

export const { setUSDBalance, setCryptoBalance, setTRDBalance, setUserStaking, setUserDeposit } = userSlice.actions

export default userSlice.reducer