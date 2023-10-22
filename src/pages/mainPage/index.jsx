import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CryptoChart from '../../Components/CryptoChart/CryptoChart';
import { Link } from "react-router-dom";

import loadImg from "./load.svg";

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

    if (market === 'load' || cryptoBalance === 'load' || chart7DaysAllCrypto === 'load') {
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
                    <p className='table-item__chart'>7 days chart</p>
                </div>

                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
        )
    } else {

        const filteredMarket = market.filter((crypto) => {
            return crypto.name.toLowerCase().includes(searchText.toLowerCase());
        });

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
                    <p className='table-item__chart'>7 days chart</p>
                </div>

                {filteredMarket.length === 0 ? (
                    <p className="table-item text-gray-400 text-lg font-semibold">No results found.</p>
                ) : (
                    filteredMarket.map((crypto) => {
                        const statusStyle = parseFloat(crypto.change) < 0 ? 'red' : 'green';

                        let name;

                        if (crypto.name.length > 9) {
                            name = crypto.name.slice(0, 9) + "...";
                        } else {
                            name = crypto.name;
                        }

                        return (
                            <Link key={crypto.id} to={`${crypto.name}`} className="table-item">
                                <div className='table-item__search'>
                                    <img className='table-item__icon' src={crypto.image} alt='icon' />
                                    <p>{name}</p>
                                </div>
                                <div className='table-item__balance'>
                                    <span className='total'>{cryptoBalance?.[crypto.symbol]?.total || 0} </span>
                                    <span className='symbol'>{crypto.symbol.toUpperCase()}</span>
                                </div>
                                <p className='table-item__value'>{(cryptoBalance?.[crypto.symbol]?.total || 0) * crypto.price}</p>
                                <p className='table-item__price'>${crypto.price}</p>
                                <p className={`table-item__24h ${statusStyle}`}>{crypto.change.toFixed(2)}</p>
                                {/* Відобразіть дані про портфоліо для кожної криптовалюти */}
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
                            </Link>
                        );
                    })
                )}
            </div>
        );
    }
}