import React, { useEffect, useState } from 'react';
import { convertCrypto, getListUserCrypto } from '../../server';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setCryptoBalance } from "../../slices/userSlice";

import CriptoForm from "../../Components/CryptoForm/CriptoForm";

import arrow from "./arrow.svg";
import checkImg from "./check.svg"

import "./convertation.css"

export default function ConvertationPage() {
    const user  = useSelector(state => state.user.cryptoBalance);
    const market  = useSelector(state => state.market.market);

    const [userSelectCripto, setUserSelectCripto] = useState(null);
    const [marketSelectCripto, setMarketSelectCripto] = useState(null);

    const [marketInputPrice, setMarketInputPrice] = useState(0);
    const [userInputPrice, setUserInputPrice] = useState(100);
    const [check, setCheck] = useState(false);

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (market !== 'load' && Object.values(market).length !== 0 && user !== 'load' && Object.values(user).length !== 0) {
            const userCripto = user.find(el => el.symbol === (userSelectCripto || user[0]).symbol);
                
            const dolar = userCripto.price * userInputPrice;

            const marketCripto = market.find(el => el.symbol === (marketSelectCripto || market[0]).symbol);
            
            setMarketInputPrice(dolar / marketCripto.price);
        }
    }, [userSelectCripto, marketSelectCripto]);


    if (market === 'load' || user === 'load') {
        return (
            <div className="replenishmentPage">
                Loading...
            </div>
        );
    } else {
        const buttonHandler = () => {
            if (marketSelectCripto) {
                setIsLoading(true); // Починаємо завантаження
    
                convertCrypto(userSelectCripto.name, marketSelectCripto.symbol, userInputPrice)
                    .then(() => {
                        getListUserCrypto().then((data) => {
                            dispatch(setCryptoBalance(data.balanceCrypto));
                            showNotification('Currency purchased successfully', true);
                        });
                    })
                    .catch(() => {
                        showNotification('Transaction failed', false);
                    })
                    .finally(() => {
                        setIsLoading(false); // Закінчили завантаження (незалежно від результату)
                    });
            } else {
                console.error('No currency selected.');
            }
        };
    
        const showNotification = (message, isSuccess) => {
            setNotification({ message, isSuccess });
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        };
    
        
        function onClickCheckbox() {
            setCheck((state) => !state);
        }

        return (
            <div className="replenishmentPage">
            <div className='crypto-form'>

                {
                    Object.values(user).length !== 0 
                    ?
                    <div className="left">
                        <img className='crypto-form__img' src={(userSelectCripto || Object.values(user)[0])?.image} alt="" />
                        <div className="row">
                            <CriptoForm inputHandler={setUserInputPrice}
                                inputValue={userInputPrice} />
                            <CurrencyDropdown criptoList={user} selectedCripto={(userSelectCripto || Object.values(user)[0])} setSelectedCripto={setUserSelectCripto} />
                        </div>
                    </div>
                    :
                    <div className="left">
                        <div className="col">
                            <p>There is no cryptocurrency on your wallet.</p>
                            <Link to='/replenishment' className='buy'>Would you like to buy?</Link>
                        </div>
                    </div>
                }
                
                <div className="arrow">
                    <img src={arrow} alt="" />
                </div>
                <div className="right">
                    <img className='crypto-form__img' src={(marketSelectCripto || market[0]).image} alt=""/>
                    <div className="row">
                        <CriptoForm inputHandler={setMarketInputPrice}
                            inputValue={marketInputPrice} readOnly />
    
                        <CurrencyDropdown criptoList={market} selectedCripto={(marketSelectCripto || market[0])} setSelectedCripto={setMarketSelectCripto} />
                    </div>
                </div>
            </div>
            <p className='crypto-form__text'>
                {

                }
            </p>
    
            <div className='checkbox-container' onClick={onClickCheckbox}>
                <div className="checkbox" >{check ? <img src={checkImg} alt="" /> : null}</div>
                <p>I agree to the Terms of Service</p>
            </div>
            <button className="crypto-form__button"
                onClick={buttonHandler}
                disabled={isLoading} // Вимикаємо кнопку під час завантаження
            >
                {isLoading ? 'Loading...' : 'Exchange'}
            </button>
            {notification && (
                <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                    {notification.message}
                </div>
            )}
        </div>
        );
    }
};