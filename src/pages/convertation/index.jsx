import React, { useEffect, useState } from 'react';
import { BsArrowRightShort } from 'react-icons/bs';
import { convertCrypto, getListUserCrypto } from '../../server';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';
import { useSelector, useDispatch } from 'react-redux';

import { setCryptoBalance } from "../../slices/userSlice";

import CriptoForm from "../../Components/CryptoForm/CriptoForm";

import "./convertation.css"

const ConvertationPage = () => {
    const market  = useSelector(state => state.market.market);
    const user  = useSelector(state => state.user.cryptoBalance);
    const [selectedCripto, setSelectedCripto] = useState(null);
    const [userSelectCripto, setUserCripto] = useState(null);
    const [convertPrice, setConvertPrice] = useState(1);
    const [userPrice, setUserPrice] = useState(100);
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (market !== 'load' && market) {
            const selectCripto = market.find(el => el.symbol === (selectedCripto || market[0]).symbol);
            if (selectCripto) {
                setConvertPrice(userPrice / selectCripto.price);
            }
        }
    }, [selectedCripto, market, userPrice]);


    if (market === 'load' || user === 'load') {
        return (
            <div className="replenishmentPage">
                Loading...
            </div>
        );
    } else {

        console.log(market);
        console.log(user);

        const buttonHandler = () => {
            if (selectedCripto) {
                setIsLoading(true); // Починаємо завантаження
    
                convertCrypto(userSelectCripto.name, selectedCripto.symbol, userPrice)
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
    
        return (
            <div className="replenishmentPage">
            <div className='crypto-form'>
                <div className="left">
                    <img className='crypto-form__img' src={(userSelectCripto || Object.values(user)[0]).image} alt="" />
                    <div className="row">
                        <CriptoForm inputHandler={setUserPrice}
                            inputValue={userPrice} />
                        <CurrencyDropdown criptoList={user} selectedCripto={(userSelectCripto || Object.values(user)[0])} setSelectedCripto={setUserCripto} />
                    </div>
                </div>
                <div className="arrow">
                    <BsArrowRightShort className="text-2xl text-gray-500" />
                </div>
                <div className="right">
                    <img className='crypto-form__img' src={(selectedCripto || market[0]).image} alt=""/>
                    <div className="row">
                        <CriptoForm inputHandler={setConvertPrice}
                            inputValue={convertPrice} readOnly />
    
                        <CurrencyDropdown criptoList={market} selectedCripto={(selectedCripto || market[0])} setSelectedCripto={setSelectedCripto} />
                    </div>
                    <p className="reward-text">Reward: {userPrice * 0.0303954} TRD</p>
                </div>
            </div>
            <p className='crypto-form__text'>5% fees (min 10 USD) are included in the price The average delivery time is 10 to 30 minutes</p>
    
            <div className='row'>
                <input type="checkbox"></input>
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

export default ConvertationPage;