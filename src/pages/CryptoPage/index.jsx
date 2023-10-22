import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { Tabs } from '../../Components/Tabs/Tabs';

import arrowBack from "./arrow_back.svg";
import loadImg from "./load.svg";

import "./CryptoPage.css";

const CryptoPage = () => {
    const { name } = useParams();

    const marketArr = useSelector(state => state.market.market);
    const userArr = useSelector(state => state.user.cryptoBalance);

    const [user, setUser] = useState(null);
    const [market, setMarket] = useState(null);

    useEffect(() => {
        if (marketArr !== 'load'  && userArr !== 'load') {
            if (Object.values(userArr).length !== 0) {
                const crypto = marketArr.find(item => item.name === name)
    
                setMarket(crypto);
                setUser(userArr[crypto.symbol]);
            }
        }
        
    }, [marketArr, userArr])

    if (!market || userArr === 'load') {
        return (
            <div className='cryptoPage'>
                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
        )
    } else {
        console.log()

        return (
            <div className='cryptoPage'>
                <Link to={"/"} className='back'>
                    <img src={arrowBack} alt="" />
                </Link>

                <div div className="nameCrypto" >
                    <img src={market?.image} alt="" />
                    <p className='name'>{name}</p>
                </div >
                <div className="balanceInfo">
                    <div className="balanceInfo__crypto">
                        <p>{user?.total || 0} <span className='gray'>{market.symbol.toUpperCase()}</span></p>
                    </div>
    
                    <div className="balanceInfo__USD">
                        <p>{user?.total / user?.courseOnDolar || 0} <span >USD</span></p>
                    </div>
                </div>
                <div className="сtyptoButtons">
                    <button>Receive</button>
                    <button>Send</button>
                </div>
    
                <Tabs name={market.symbol} />
            </div >
        )
    }
}

export default CryptoPage;
