import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CryptoChart from '../../Components/CryptoChart/CryptoChart';
import { NavLink } from "react-router-dom";

import "./MainPage.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
);

export const options = {
    responsive: true,
    pointStyle: false,
    scales: {
        y: {
            display: false, // Вимкнути вісь y
        },
    },
};

export default function MainPage() {
    const market = useSelector(state => state.market.market);
    const cryptoBalance = useSelector(state => state.user.cryptoBalance);
    const chart7DaysAllCrypto = useSelector(state => state.chart.chart7DaysAllCrypto);

    const [searchText, setSearchText] = useState("");

    const filteredMarket = market.filter((crypto) => {
        return crypto.name.toLowerCase().includes(searchText.toLowerCase());
    });

    const totalPortfolioValue = filteredMarket.reduce((total, crypto) => {
        return total + (cryptoBalance?.[crypto.symbol]?.total || 0) * crypto.price;
    }, 0);

    const portfolio = filteredMarket.map((crypto) => {
        const cryptoValue = (cryptoBalance?.[crypto.symbol]?.total || 0) * crypto.price;
        const percentageOfPortfolio = (cryptoValue / totalPortfolioValue) * 100;

        return {
            name: crypto.name,
            symbol: crypto.symbol,
            percentage: percentageOfPortfolio,
        };
    });

    const formatMCap = (value) => {
        if (value >= 1e9) {
            return (value / 1e9).toFixed(2) + "B";
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(2) + "M";
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(2) + "K";
        }
        return value.toFixed(2);
    };

    return (
        <div>
            <div className="table-item table-title">
                <div className='table-item__search'>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <p className='table-item__balance'>Balance</p>
                <p className='table-item__value'>Value</p>
                <p className='table-item__price'>Price</p>
                <p className='table-item__24h'>24h</p>
                <p className='table-item__portfolio'>Portfolio</p>
                <p className='table-item__mCap'>M. cap</p>
                <p className='table-item__chart'>7 days chart</p>
            </div>

            {filteredMarket.length === 0 ? (
                <p className="table-item text-gray-400 text-lg font-semibold">No results found.</p>
            ) : (
                filteredMarket.map((crypto, index) => {
                    const statusStyle = parseFloat(crypto.change) < 0 ? 'red' : 'green';

                    // Отримайте дані про портфоліо для кожної криптовалюти
                    const cryptoPortfolio = portfolio.find((item) => item.symbol === crypto.symbol);

                    let name;

                    if (crypto.name.length > 9) {
                        name = crypto.name.slice(0, 9) + "...";
                    } else {
                        name = crypto.name;
                    }

                    return (
                        <NavLink key={crypto.id} to={`${crypto.name}`} className="table-item">
                            <div className='table-item__search'>
                                <img className='table-item__icon' src={crypto.image} alt='icon' />
                                <p>{name}</p>
                            </div>
                            <div className='table-item__balance'>
                                <span className='total'>{cryptoBalance?.[crypto.symbol]?.total || 0} </span>
                                <span className='symbol'>{crypto.symbol.toUpperCase()}</span>
                            </div>
                            <p className='table-item__value'>{cryptoPortfolio ? `${cryptoPortfolio.percentage.toFixed(2)}%` : "N/A"}</p>
                            <p className='table-item__price'>${crypto.price}</p>
                            <p className={`table-item__24h ${statusStyle}`}>{crypto.change.toFixed(2)}</p>
                            {/* Відобразіть дані про портфоліо для кожної криптовалюти */}
                            <p className='table-item__portfolio'>{cryptoPortfolio ? `${cryptoPortfolio.percentage.toFixed(2)}%` : "N/A"}</p>
                            <p className='table-item__mCap'>{formatMCap(crypto.MCap)}</p>
                            <div className='table-item__chart'>
                                <CryptoChart chartData={{
                                    labels: ['', '', '', '', '', '', ''],
                                    datasets: [
                                        {
                                            label: 'Dataset 4',
                                            data: chart7DaysAllCrypto?.[crypto.name]?.map(el => el.price),
                                            borderColor: 'rgb(53, 162, 2325)',
                                            fill: false,
                                        },
                                    ],
                                }} />
                            </div>
                        </NavLink>
                    );
                })
            )}
        </div>
    );
}
