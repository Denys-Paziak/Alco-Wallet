import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useEffect } from "react";

import { MainPage, ReplenishmentPage, ConvertationPage, BuyUSD, StakingPage, StakingInfo, CryptoPage, StakedPage } from "./pages";
import Menu from './Components/Menu/Menu';

import { setUSDBalance, setCryptoBalance, setTRDBalance, setUserStaking } from "./slices/userSlice";
import { setMarket } from "./slices/marketSlice";
import { setStaking } from "./slices/stakingSlice";
import { setChart7DaysAllCrypto } from "./slices/chartSlice";
import { setHistory } from "./slices/historySlice";
import * as server from './server';

import "./style.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    server.getBalance().then((data) => {
      dispatch(setUSDBalance(data.balance));
    });
    server.getListUserCrypto().then((data) => {
      dispatch(setCryptoBalance(data.balanceCrypto));
    });
    server.getTRDBalance().then((data) => {
      dispatch(setTRDBalance(data.balanceTRD));
    });
    server.getUserStaking().then((data) => {
      dispatch(setUserStaking(data.userStaking));
    });
    server.getListCrypto().then((data) => {
      dispatch(setMarket(data));
    });
    server.getStakingCrypto().then((data) => {
      dispatch(setStaking(data));
    });
    server.getSevenDaysСhart().then((data) => {
      dispatch(setChart7DaysAllCrypto(data.body));
    });
    server.getHistory().then((data) => {
      dispatch(setHistory(data.userHistory));
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:name" element={<CryptoPage />} />
          <Route path="replenishment" element={<ReplenishmentPage />} />
          <Route path="convertation" element={<ConvertationPage />} />
          <Route path="buyUSD" element={<BuyUSD />} />
          <Route path="staking" element={<StakingPage />} />
          <Route path="staking/:name" element={<StakingInfo />} />
          <Route path="staking/:name/stake" element={<StakedPage />} />
        </Routes>
        <Menu />
      </div>
    </Router>
  );
}

export default App;
