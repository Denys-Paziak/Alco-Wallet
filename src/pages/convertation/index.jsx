import React, { useEffect, useState } from 'react';
import { convertCrypto, getListUserCrypto } from '../../server';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setCryptoBalance } from "../../slices/userSlice";

import CriptoForm from "../../Components/CryptoForm/CriptoForm";
import LimitedMessage from '../../Components/LimitedMessage/LimitedMessage';

import arrow from "./arrow.svg";
import checkImg from "./check.svg"

import "./convertation.css"

export default function ConvertationPage() {
    const user = useSelector(state => state.user.cryptoBalance);
    const market = useSelector(state => state.market.market);

    const [userSelectCripto, setUserSelectCripto] = useState({});
    const [marketSelectCripto, setMarketSelectCripto] = useState(null);

    const [marketInputPrice, setMarketInputPrice] = useState(0);
    const [userInputPrice, setUserInputPrice] = useState(0);

    const [check, setCheck] = useState(false);
    const [limitedInput, setLimitedInput] = useState('min');

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if ((Object.values(userSelectCripto).length !== 0) && marketSelectCripto) {
            const userCripto = user[userSelectCripto.name];

            const dolar = userCripto.courseOnCrypto * userInputPrice;

            const marketCripto = market.find(el => el.symbol === marketSelectCripto.symbol);

            setMarketInputPrice(dolar / marketCripto.price);
        }
    }, [userSelectCripto, marketSelectCripto, userInputPrice]);

    useEffect(() => {
        if (user !== 'load' && Object.values(user).length !== 0) {
            setUserSelectCripto(Object.values(user)[0]);
        }
        if (market !== 'load' && Object.values(market).length !== 0) {
            const filteredCryptoList = market.filter((item) => !user?.[item.symbol]);

            setMarketSelectCripto(filteredCryptoList[0]);
            
        }
    }, [market, user]);

    if (!marketSelectCripto || user === "load") {
        return (
            <div className="replenishmentPage loading">
                Loading...
            </div>
        );
    } else {
        const buttonHandler = () => {
            if (userInputPrice) {
                setIsLoading(true); // Починаємо завантаження

                convertCrypto(userSelectCripto.name, marketSelectCripto.symbol, userInputPrice)
                    .then(() => {
                        getListUserCrypto().then((data) => {
                            dispatch(setCryptoBalance(data.balanceCrypto));
                            showNotification('Currency purchased successfully', true);
                            setIsLoading(false);
                        });
                    })
                    .catch(() => {
                        showNotification('Transaction failed', false);
                        setIsLoading(false);
                    });
            } else {
                console.error('No currency data.');
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

        function onSendAll() {
            setUserInputPrice(userSelectCripto.total);
            setLimitedInput("value");
        }

        function limitedValidator(value) {
            const max = parseFloat(userSelectCripto.total);
            const min = (10 / userSelectCripto.courseOnCrypto).toFixed(4);

            if (parseFloat(value) > max) {
                setLimitedInput("max");
            } else if (parseFloat(value) < min) {
                setLimitedInput("min");
            } else {
                setLimitedInput("value");
            }
        }

        const filteredCryptoList = market.filter((item) => item.symbol !== userSelectCripto.name);

        return (
            <div className="replenishmentPage">
                <div className='crypto-form'>
                    {
                        Object.values(userSelectCripto).length !== 0
                            ?
                            <div className="left">
                                <img className='crypto-form__img' src={userSelectCripto.image} alt="" />
                                <div className="row">
                                    <CriptoForm
                                        inputHandler={setUserInputPrice}
                                        inputValue={userInputPrice}
                                        limitedValidator={limitedValidator}
                                    />
                                    <p className='sendAll' onClick={onSendAll}>Send all</p>
                                    <CurrencyDropdown
                                        list={user}
                                        selected={userSelectCripto}
                                        setSelected={setUserSelectCripto} />
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
                        <img className='crypto-form__img' src={marketSelectCripto.image} alt="" />
                        <div className="row">
                            <CriptoForm 
                                inputHandler={setMarketInputPrice}
                                inputValue={marketInputPrice} 
                                readOnly />

                            <CurrencyDropdown 
                                list={filteredCryptoList} 
                                selected={marketSelectCripto} 
                                setSelected={setMarketSelectCripto} />
                        </div>
                    </div>
                </div>
                    {
                    (Object.values(userSelectCripto).length !== 0 && user !== "load") 
                    ? 
                    <LimitedMessage crypto={userSelectCripto} limitedResult={limitedInput}/> 
                    : 
                    null
                    }
                <div className='checkbox-container' onClick={onClickCheckbox}>
                    <div className="checkbox" >{check ? <img src={checkImg} alt="" /> : null}</div>
                    <p>I agree to the Terms of Service</p>
                </div>
                <button className={"crypto-form__button" + ((!check || isLoading || (limitedInput !== "value")) ? " disablet" : "")}
                    onClick={buttonHandler}
                    disabled={!check || isLoading || (limitedInput !== "value")} // Вимикаємо кнопку під час завантаження
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
