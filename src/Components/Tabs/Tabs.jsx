import React, { useState, useEffect } from 'react';
import "./Tabs.css";

import { Line } from 'react-chartjs-2';
const options = {
    responsive: true,
};



const menuItem = ["Transactions", "Price chart", "About"];

export const Tabs = ({ name }) => {
    const [activeElMenu, setActiveElMenu] = useState(1);
    let showComponent;

    if (activeElMenu === 0) {
        showComponent = <Transactions />
    }

    if (activeElMenu === 1) {
        showComponent = <PriceChart name={name} />
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


const Transactions = () => {
    return (
        <div className='transactions'>

        </div>
    )
}
const PriceChart = ({ name }) => {

    const labels = ['2008', '', '', '', '', '', '', '', '', '', '', '', '', '2009', "", "", '', '', '', '', '', '', '', '', '', '', '2010', '', '', '', '', '', '', '', '', '', '', '', '', '2011', '', '', '', '', '', '', '', '', '', '', '', '', '2012', '', '', '', '', '', '', '', '', '', '', '', '2013', '', '', '', ''];


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

    const randomPatternArray = generateRandomPatternArray(numPoints);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: randomPatternArray,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };


    return (
        <div className='chartCrypto'>
            <Line
                options={options}
                data={data}
            />
        </div >
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
