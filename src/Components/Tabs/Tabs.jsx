import React, { useState } from 'react';
import { BuyError } from '../BuyError/BuyError';
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { useSelector } from 'react-redux';
import formatDate from '../../function/convertDate';
import "./Tabs.css";

import red from "./red.svg";
import green from "./green.svg";

import { Line } from 'react-chartjs-2';
const options = {
        tension: 0.5,
        responsive: true,
};



const menuItem = ["Transactions", "Price chart", "About"];

export const Tabs = ({market, name }) => {
    const [activeElMenu, setActiveElMenu] = useState(1);
    let showComponent;

    if (activeElMenu === 0) {
        showComponent = <Transactions name={name} />
    }

    if (activeElMenu === 1) {
        showComponent = <PriceChart market={market} />
    }

    if (activeElMenu === 2) {
        showComponent = <About />
    }

 

    return (
        <div className="tabs">
            <div className='tabs-nav'>
                {menuItem.map((el, index) => {
                    if (index === activeElMenu) {
                        console.log(index)
                        return <div className='active-item'
                            onClick={() => { setActiveElMenu(index) }}
                            key={index + el}>{el}</div>
                    } else {
                        return <div key={index + el} onClick={() => { setActiveElMenu(index) }}>{el}</div>
                    }
                })}
            </div>
            

            {showComponent}
        </div>

    )
}


const Transactions = ({ name }) => {
    const history = useSelector(state => state.history.historyAll);
    const reversedHistory = history.slice().reverse().filter(el => el.body?.fromCrypto === name || el.body?.toCrypto === name);


    if (reversedHistory.length > 0) {


        return <div className='history'>
            <p>Your transaction history </p>

            <div className="history-container">
                {
                    reversedHistory.map(el => {
    
                        let left;
                        let subLeft = null; 
                        let right;
                        let title;
                        let arrow  = <BsArrowRight />;

                        if (el.type === "Deposit") {
                            left =  `${el.body.total} ${el.body.fromCrypto.toUpperCase()}`;
                            right = `${el.body.period[0]} days deposit`;
                            title = "Make a deposit";
                        } else if (el.type === "Undeposit") {
                            left = `${el.body.result} ${el.body.fromCrypto.toUpperCase()}`;
                            subLeft = `${el.body.result - el.body.total} Earnings`
                            right = `${el.body.period[0]} days deposit`;
                            title = "Withdrawal of deposit";
                            arrow = <BsArrowLeft />;
                        } else if (el.type === "Staking") {
                            left = `${el.body.total} ${el.body.fromCrypto.toUpperCase()}`;
                            right = `${el.body.validator } Validator`;
                            title = el.type;
                        } else if (el.type === "Unstaking") {
                            left = `${el.body.result} ${el.body.fromCrypto.toUpperCase()}`;
                            subLeft = `${el.body.result - el.body.total} Rewards`
                            right = `${el.body.validator } Validator`;
                            title = el.type;
                            arrow = <BsArrowLeft />;
                        } else if (el.type === "Send") {
                            left = `${el.body.fromCrypto.toUpperCase()}`;
                            subLeft = `${el.body.result} Total`
                            right = `Addresses ${el.body.addresses }`;
                            title = el.type;
                        } else {
                            left = `${el.body.total} ${el.body.fromCrypto.toUpperCase()}`;
                            right = `${el.body.result} ${el.body.toCrypto.toUpperCase()}`;
                            title = el.type;
                        }


                        return (
                            <div key={el.id} className={`history-item ${el.type}`}>
                                <div className="row">
                                    <div className="history-item__type">{title}</div>
                                    <div className="history-item__date">{formatDate(el.date)}</div>
                                </div>
                                <div className="row">
                                    <div className="history-item__from">{left} <div style={{fontSize: 16}}>{subLeft}</div> </div>
                                    <div className="history-item__arrow">
                                        {arrow}
                                    </div>
                                    <div className="history-item__to">{right}</div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    } else {
        return <BuyError />
    }

}
const PriceChart = ({ market }) => {

    const labels = [
    '2019', '', '', '', '', '', '', '', '', '', '', '', '', 
    '2020', "", "", '', '', '', '', '', '', '', '', '', '', 
    '2021', '', '', '', '', '', '', '', '', '', '', '', '', 
    '2022', '', '', '', '', '', '', '', '', '', '', '', '', 
    '2023', '', '', '', '', '', '', '', '', '', '', '', ''
    ];

    let cryptoChange;

    if (market.change.toFixed(2) > 0) {
        cryptoChange = <div className='change' style={{color: "#00FF47"}}>
            <span style={{color: "white", opacity: 0.5}}>24H</span>
            {'+' + market.change.toFixed(2)}
            <img src={green} alt="" /> 
            </div> 
    } else {
        cryptoChange = <div className='change' style={{color: "#FE3333"}}>
            <span style={{color: "white", opacity: 0.5}}>24H</span>
            {market.change.toFixed(2)}
            <img src={red} alt="" />  
        </div> 
    }

    const numPoints = 100;

    function generateRandomPatternArray(numPoints) {
        const array = [];
        let value = Math.random() * 1000; // Початкове випадкове значення

        for (let i = 0; i < numPoints; i++) {
            // Змінюємо значення на випадкову величину в межах [-2, 2]
            value += Math.random() * 400 - 200;

            // Обмежуємо значення в межах [0, 60]
            value = Math.max(0, Math.min(6000, value));

            array.push(Math.round(value));
        }

        return array;
    }

    const randomPatternArray = generateRandomPatternArray(numPoints);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: randomPatternArray,
                borderColor: 'rgb(235, 0, 255)',
                fill: 'start',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, -10, 0, 320);
                    gradient.addColorStop(0, "rgb(235, 0, 255, 0.4)");
                    gradient.addColorStop(1, "rgba(235, 0, 255 ,0)");
                    return gradient;
                },
            },
        ],
    };


    return (
        <>
            <div className='marketInfo'>
                    <div className='price'>${market.price}</div>
                    {cryptoChange}
            </div>
            <div className='chartCrypto'>
            <Line
                width="400px"
                height="110px"
                options={options}
                data={data}
            />
        </div >
        </>
        
    )
}
const About = () => {
    return (
        <div className="about-container">
            <div className="about-item">
                <img src="/about/1.jpg" alt="" />
                <p>Ethereum vs Bitcoin: Differences between ETH and BTC</p>
            </div>
            <div className="about-item">
                <img src="/about/2.jpg" alt="" />
                <p>BCH vs. BTC - What's the difference between Bitcoin Cash and Bitcoin</p>
            </div>
            <div className="about-item">
                <img src="/about/3.jpg" alt="" />
                <p>What is Bitcoin: Explained
                </p>
            </div>
            <div className="about-item">
                <img src="/about/4.jpg" alt="" />
                <p>How to Buy Bitcoin on Algo Wallet?</p>
            </div>
            <div className="about-item">
                <img src="/about/5.jpg" alt="" />
                <p>BCH vs. BTC - What's the difference between Bitcoin Cash and Bitcoin</p>
            </div>
            <div className="about-item">
                <img src="/about/6.jpg" alt="" />
                <p>How to Buy Bitcoin on Algo Wallet?</p>
            </div>
            <div className="about-item">
                <img src="/about/7.jpg" alt="" />
                <p>What is Bitcoin: Explained
                </p>
            </div>
            <div className="about-item">
                <img src="/about/8.jpg" alt="" />
                <p>Ethereum vs Bitcoin: Differences between ETH and BTC</p>
            </div>
        </div>
    )
}
