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
    };

    return (
        <div className='table-item__chart'>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default CryptoChart;