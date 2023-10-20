import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import { Tabs } from '../../Components/Tabs/Tabs';

import "./CryptoPage.css";

const CryptoPage = () => {
    const { name } = useParams();

    const market = useSelector(state => state.market.market).find(item => item.name === name);
    const user = useSelector(state => state.user.cryptoBalance)[market.symbol];


    return (
        <div className='cryptoPage'>
            <div div className="nameCrypto" >
                <img src={market?.image} alt="" />
            </div >
            <div className="balanceInfo">
                <div className="balanceInfo__crypto">
                    <p>{user?.total || 0} <span className='gray'>{name}</span></p>
                </div>

                <div className="balanceInfo__USD">
                    <p>{user?.total / user?.courseOnDolar || 0} <span className='gray'>USD</span></p>
                </div>

            </div>
            <div className="сtyptoButtons">
                <button>Receive</button>
                <button>Send</button>
            </div>

            <Tabs name={name} />
        </div >
    )
}

export default CryptoPage;
