import React from 'react';
import { Line } from 'react-chartjs-2';

const CryptoChart = ({ chartData }) => {


    const options = {
        responsive: true,
        pointStyle: false,
        scales: {
            y: {
                display: false,
            },
        },
        tension: 0.5
    };

    return (
        <div className='table-item__chart'>
            <div className='posithion'>
                <Line width="300px" height="70px" options={options} data={chartData} />
            </div>
        </div>
    );
};

export default CryptoChart;