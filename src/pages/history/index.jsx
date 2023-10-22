import React from 'react';
import { useSelector } from 'react-redux';

import "./history.css"
import { BuyError } from '../../Components/BuyError/BuyError';
import { BsArrowRight } from 'react-icons/bs';
import formatDate from '../../function/convertDate';


export default function HistoryPage() {

    const history = useSelector(state => state.history.historyAll);
    console.log(history);


    if (history.length > 0) {
        return <div className='history'>
            <p>Your transaction history </p>

            <div className="history-container">
                {
                    history.map(el => {
                        return (
                            <div className={`history-item ${el.type}`}>
                                <div className="row">
                                    <div className="history-item__type">{el.type}</div>
                                    <div className="history-item__date">{formatDate(el.date)}</div>
                                </div>
                                <div className="row">
                                    <div className="history-item__from">0.000015926 ETH</div>
                                    <div className="history-item__arrow">
                                        <BsArrowRight />
                                    </div>
                                    <div className="history-item__to">0.000015926 BTC</div>
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


};