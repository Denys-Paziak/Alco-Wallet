import React from 'react';
import { useSelector } from 'react-redux';

import "./history.css"
import { BuyError } from '../../Components/BuyError/BuyError';
import { BsArrowRight } from 'react-icons/bs';
import formatDate from '../../function/convertDate';


export default function HistoryPage() {

    const history = useSelector(state => state.history.historyAll);
    const reversedHistory = history.slice().reverse();


    if (reversedHistory.length > 0) {

        return <div className='history'>
            <p>Your transaction history </p>

            <div className="history-container">
                {
                    reversedHistory.map(el => {

                        let left;
                        let right;
                        let title;

                        if (el.type == "Deposit") {
                            left = `${el.body.period[0]} days deposit`;
                            right = `${el.body.total} ${el.body.fromCrypto}`;
                            title = "Make a deposit";
                        } else if (el.type == "Undeposit") {
                            left = `${el.body} days deposit`;
                            right = `${el.body.total} ${el.body.fromCrypto}`;
                            title = "Withdrawal of deposit";
                        } else {
                            left = `${el.body.total} ${el.body.fromCrypto}`;
                            right = `${el.body.result} ${el.body.toCrypto}`;
                            title = el.type;
                        }


                        return (
                            <div className={`history-item ${el.type}`}>
                                <div className="row">
                                    <div className="history-item__type">{title}</div>
                                    <div className="history-item__date">{formatDate(el.date)}</div>
                                </div>
                                <div className="row">
                                    <div className="history-item__from">{left}</div>
                                    <div className="history-item__arrow">
                                        <BsArrowRight />
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



};