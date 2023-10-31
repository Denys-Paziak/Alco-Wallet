import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CryptoChart from '../../Components/CryptoChart/CryptoChart';
import { Link } from "react-router-dom";

import loadImg from "./load.svg";
import red from "./red.svg";
import green from "./green.svg";

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
    let value = Math.random() * 105; // Початкове випадкове значення

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
                        const statusStyle = parseFloat(crypto.change) < 0 ? 'red' : 'green';

                        const randomPatternArray = generateRandomPatternArray(numPoints);

                        const data = {
                            labels,
                            datasets: [
                                {
                                    label: 'Dataset 1',
                                    data: randomPatternArray,
                                    borderColor: statusStyle === 'red' ? 'rgb(254, 51, 51)' : 'rgb(0, 255, 71)',
                                    fill: "start",
                                    backgroundColor: statusStyle === 'red' ? (context) => {
                                        const ctx = context.chart.ctx;
                                        const gradient = ctx.createLinearGradient(0, -10, 0, 44);
                                        gradient.addColorStop(0, "rgba(254, 51, 51, 0.4)");
                                        gradient.addColorStop(1, "rgba(254, 51, 51 ,0)");
                                        return gradient;
                                    } : (context) => {
                                        const ctx = context.chart.ctx;
                                        const gradient = ctx.createLinearGradient(0, -10, 0, 44);
                                        gradient.addColorStop(0, "rgba(0, 255, 71, 0.4)");
                                        gradient.addColorStop(1, "rgba(0, 255, 71 ,0)");
                                        return gradient;
                                    },

                                },
                            ],
                        };

                        let name;
                        let value = (cryptoBalance?.[crypto.symbol]?.total) * crypto.price;
                        let balance = cryptoBalance?.[crypto.symbol]?.total;
                        let cryptoChange;

                        if (crypto.name.length > 9) {
                            name = crypto.name.slice(0, 9) + "...";
                        } else {
                            name = crypto.name;
                        }

                        if (crypto.change.toFixed(2) > 0) {
                            cryptoChange = <><img src={green} alt="" /> {'+' + crypto.change.toFixed(2)}</>
                        } else {
                            cryptoChange = <><img src={red} alt="" /> {crypto.change.toFixed(2)}</>
                        }

                        return (
                            <Link key={crypto.id} to={`${crypto.name}`} className="table-item">
                                <div className='table-item__search'>
                                    <img className='table-item__icon' src={crypto.image} alt='icon' />
                                    <p>{name}</p>
                                </div>
                                <div className='table-item__balance'>
                                    <span className='total' title={balance}>{formatNumber(balance) || 0} </span>
                                    <span className='symbol'>{crypto.symbol.toUpperCase()}</span>
                                </div>
                                <p className='table-item__value' title={value}>${formatNumber(value) || 0}</p>
                                <p className='table-item__price'>${formatNumber(crypto.price)}</p>
                                <p className={`table-item__24h ${statusStyle}`}>{cryptoChange}</p>
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

function formatNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return false;
    }

    // Округлюємо число до 2 десяткових знаків
    const roundedNumber = Math.round(number * 100) / 100;

    // Розділяємо цілу та десяткову частини
    const parts = roundedNumber.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '00';

    // Форматуємо цілу частину, розділяючи тисячі комою
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Повертаємо сформатоване число
    return `${formattedIntegerPart}.${decimalPart}`;
}