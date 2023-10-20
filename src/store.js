import { configureStore } from '@reduxjs/toolkit'
import user from "./slices/userSlice";
import staking from "./slices/stakingSlice";
import market from './slices/marketSlice';
import chart from './slices/chartSlice';
import history from "./slices/historySlice"

export default configureStore({
    reducer: { user, staking, market, chart, history }
});