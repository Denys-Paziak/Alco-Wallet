import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    historyAll: 'load',
    historyBuy: [],
    historyConvert: [],
    historyStaking: [],
}

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setHistory: (state, action) => {
            state.historyAll = action.payload;
            state.historyBuy = action.payload.filter((item) => item.type === 'Buy');
            state.historyConvert = action.payload.filter((item) => item.type === 'Convert');
            state.historyStaking = action.payload.filter((item) => item.type === 'Staking');
        }
    }
})
 
export const { setHistory } = historySlice.actions

export default historySlice.reducer