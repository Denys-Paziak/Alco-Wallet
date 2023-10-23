import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    historyAll: 'load',
    historyBuy: [],
    historyConvert: [],
    historyStaking: [],
    historyStaking: []
}

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setHistory: (state, action) => {
            state.historyAll = action.payload;
            state.historyBuy = action.payload.filter((item) => item.type === 'Buy Crypto');
            state.historyConvert = action.payload.filter((item) => item.type === 'Exchange');
            state.historyStaking = action.payload.filter((item) => item.type === 'Staking');
            state.historyStaking = action.payload.filter((item) => item.type === "Deposit" || item.type === "Undeposit");
        }
    }
})
 
export const { setHistory } = historySlice.actions

export default historySlice.reducer