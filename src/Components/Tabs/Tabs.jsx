import React, { useState, useEffect } from 'react';
import "./Tabs.css";

import { getСhart } from '../../server';

import { Line } from 'react-chartjs-2';

const options = {
    responsive: true,
    pointStyle: false,
};

const menuItem = ["Transactions", "Price chart", "About"];

export const Tabs = ({name}) => {
    const [activeElMenu, setActiveElMenu] = useState(1);
    let showComponent;

    if (activeElMenu == 0) {
        showComponent = <Transactions />
    }

    if (activeElMenu == 1) {
        showComponent = <PriceChart name={name}/>
    }

    if (activeElMenu == 2) {
        showComponent = <About />
    }

    return (
        <div className="tabs">
            <div className='tabs-nav'>
                {menuItem.map((el, index) => {
                    if (index == activeElMenu) {
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
            Your USDT transactions will appear here
        </div>
    )
}
const PriceChart = ({name}) => {
    const [labelCharts, setLabelCharts] = useState([]);
    const [dataCharts, setDataCharts] = useState([]);

    console.log(labelCharts);
    console.log(dataCharts);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chartData = await getСhart(name);
                console.log(chartData);
                setLabelCharts(chartData.body.map(el => el.date));
                setDataCharts(chartData.body.map(el => parseFloat(el.price)));



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const data = {
        labels: [4, 5],
        datasets: [
            {
                label: labelCharts,
                data: dataCharts,
                borderColor: 'rgb(53, 162, 235)',
            },
        ],

    };

    return (
        <div>
            <Line
                options={options}
                data={data}
            />
        </div >
    )
}
const About = () => {
    return (
        <div>
            About
        </div >
    )
}
