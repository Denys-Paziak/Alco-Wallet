import React from 'react';

import "./history.css"
import { BuyError } from '../../Components/BuyError/BuyError';
import { BsArrowRight } from 'react-icons/bs';

export default function HistoryPage() {
    return <div className='history'>
        <p>Your transaction history </p>

        <div className="history-container">
            <div className="history-item">
                <div className="row">
                    <div className="history-item__type">Exchange</div>
                    <div className="history-item__date">18 October 2023 9:26 am</div>
                </div>
                <div className="row">
                    <div className="history-item__from">0.000015926 ETH</div>
                    <div className="history-item__arrow">
                        <BsArrowRight />
                    </div>
                    <div className="history-item__to">0.000015926 BTC</div>
                </div>
            </div>
        </div>


        {/* <BuyError /> */}
    </div>
};