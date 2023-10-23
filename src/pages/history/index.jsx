import React from 'react';
import { useSelector } from 'react-redux';

import "./history.css"
import { BuyError } from '../../Components/BuyError/BuyError';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import formatDate from '../../function/convertDate';

import loadImg from "./load.svg";

export default function HistoryPage() {

    const history = useSelector(state => state.history.historyAll);

    if (history === 'load') {
        return (
            <div className='history'>
                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
           
        )
    } else {
        const reversedHistory = history.slice().reverse();

        if (reversedHistory.length > 0) {
    
            return <div className='history'>
                <p className='titleHistory'>Your transaction history </p>
    
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
};