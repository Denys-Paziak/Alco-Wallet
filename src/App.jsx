import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useEffect } from "react";

import { MainPage, ReplenishmentPage, ConvertationPage, BuyUSD, StakingPage, StakingInfo, CryptoPage, StakedPage, HistoryPage, SettingsPage } from "./pages";
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
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/:name" element={<CryptoPage />} />
          <Route exact path="replenishment" element={<ReplenishmentPage />} />
          <Route exact path="convertation" element={<ConvertationPage />} />
          <Route exact path="buyUSD" element={<BuyUSD />} />
          <Route exact path="staking" element={<StakingPage />} />
          <Route exact path="staking/:name" element={<StakingInfo />} />
          <Route exact path="staking/:name/stake" element={<StakedPage />} />
          <Route exact path="history/" element={<HistoryPage />} />
          <Route exact path="settings/" element={<SettingsPage />} />
        </Routes>
        <Menu />
      </div>
    </Router>
  );
}

export default App;
