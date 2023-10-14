import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chart7DaysAllCrypto: {},
    chartAllOneCrypto: []
}

export const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setChart7DaysAllCrypto: (state, action) => {
            state.chart7DaysAllCrypto = action.payload
        },
        setChartAllOneCrypto: (state, action) => {
            state.chartAllOneCrypto = action.payload
        },
    }
})
 
export const { setChart7DaysAllCrypto, setChartAllOneCrypto } = chartSlice.actions

export default chartSlice.reducer