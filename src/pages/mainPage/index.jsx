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

const labels = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', "", "", '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];


const numPoints = 100;

function generateRandomPatternArray(numPoints) {
    const array = [];
    let value = Math.random() * 5; // Початкове випадкове значення

    for (let i = 0; i < numPoints; i++) {
        // Змінюємо значення на випадкову величину в межах [-2, 2]
        value += Math.random() * 4 - 2;

        // Обмежуємо значення в межах [0, 60]
        value = Math.max(0, Math.min(60, value));

        array.push(Math.round(value));
    }

    return array;
}



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
                        const randomPatternArray = generateRandomPatternArray(numPoints);

                        const data = {
                            labels,
                            datasets: [
                                {
                                    label: 'Dataset 1',
                                    data: randomPatternArray,
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgb(255, 99, 132, 0)',
                                },
                            ],
                        };


                        const statusStyle = parseFloat(crypto.change) < 0 ? 'red' : 'green';

                        let name;
                        let value;
                        let valueTitle;
                        let balance;
                        let balanceTitle;

                        if (crypto.name.length > 9) {
                            name = crypto.name.slice(0, 9) + "...";
                        } else {
                            name = crypto.name;
                        }

                        if (cryptoBalance?.[crypto.symbol]?.total.toString().length > 9) {
                            balance = cryptoBalance?.[crypto.symbol]?.total.toString().slice(0, 9) + "...";
                            balanceTitle = cryptoBalance?.[crypto.symbol]?.total;
                        } else {
                            balance = cryptoBalance?.[crypto.symbol]?.total;
                        }




                        if (((cryptoBalance?.[crypto.symbol]?.total) * crypto.price).toString().length > 9) {
                            value = ((cryptoBalance?.[crypto.symbol]?.total) * crypto.price).toString().slice(0, 9) + "...";
                            valueTitle = ((cryptoBalance?.[crypto.symbol]?.total) * crypto.price);
                        } else {
                            value = ((cryptoBalance?.[crypto.symbol]?.total) * crypto.price);
                        }

                        return (
                            <Link key={crypto.id} to={`${crypto.name}`} className="table-item">
                                <div className='table-item__search'>
                                    <img className='table-item__icon' src={crypto.image} alt='icon' />
                                    <p>{name}</p>
                                </div>
                                <div className='table-item__balance'>
                                    <span className='total' title={balanceTitle}>{balance || 0} </span>
                                    <span className='symbol'>{crypto.symbol.toUpperCase()}</span>
                                </div>
                                <p className='table-item__value' title={valueTitle}>{value || 0}</p>
                                <p className='table-item__price'>${crypto.price}</p>
                                <p className={`table-item__24h ${statusStyle}`}>{crypto.change.toFixed(2)}</p>
                                {/* Відобразіть дані про портфоліо для кожної криптовалюти */}
                                <div className='table-item__chart'>
                                    <CryptoChart chartData={data} />
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        );
    }
}