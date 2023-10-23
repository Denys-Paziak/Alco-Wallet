import React, { useEffect, useState } from 'react';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setCryptoBalance } from "../../slices/userSlice";
import { setHistory } from '../../slices/historySlice';
import { convertCrypto, getListUserCrypto, getHistory } from '../../server';


import CryptoForm from "../../Components/CryptoForm/CryptoForm";
import LimitedMessage from '../../Components/LimitedMessage/LimitedMessage';

import arrow from "./arrow.svg";
import checkImg from "./check.svg"
import loadImg from "./load.svg";

import formatDate from '../../function/convertDate';
import { BsArrowRight } from "react-icons/bs";
import "./convertation.css";
import { BuyError } from '../../Components/BuyError/BuyError';

const tabsData = ["Instant Exchange", "Order History"]

export default function ConvertationPage() {
    const [activeTab, setTab] = useState(0);

    let renderedComponent;
    if (activeTab == 0) {
        renderedComponent = <InstantExchange />
    } else {
        renderedComponent = <OrderHistory />;
    }

    return (
        <>
            <div className="page-tabs">
                {tabsData.map((el, index) => {
                    if (index === activeTab) {
                        return <div key={el} className='active'
                            onClick={() => { setTab(index); }}>{el}</div>
                    } else {
                        return <div key={el} onClick={() => { setTab(index); }}>{el}</div>
                    }

                })}
            </div>
            {renderedComponent}
        </>
    )

};

const OrderHistory = () => {
    const history = useSelector(state => state.history.historyConvert);
    const reversedHistory = history.slice().reverse();

    if (reversedHistory.length > 0) {
        return (
            <div className="history-container">
                {reversedHistory.map((el) => {
                    return (

                        <div key={el.id} className="history-item">
                            <div className="row">
                                <div className="history-item__type">{formatDate(el.date)}</div>
                                <div className="history-item__date"></div>
                            </div>
                            <div className="row">
                                <div className="history-item__from">{el.body.total} {el.body.fromCrypto.toUpperCase()}</div>
                                <div className="history-item__arrow">
                                    <BsArrowRight />
                                </div>
                                <div className="history-item__to">{el.body.result} {el.body.toCrypto.toUpperCase()}</div>
                            </div>
                        </div>
                    )
                })}

            </div>
        );
    } else {
        <BuyError />
    }
}

const InstantExchange = () => {
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
        if (market !== 'load') {
            const filteredCryptoList = market.filter((item) => item.symbol !== userSelectCripto.name);
            setMarketSelectCripto(filteredCryptoList[0]);
        }
    }, [userSelectCripto])

    useEffect(() => {
        if (user) {
            if (user !== 'load' && Object.values(user).length !== 0) {
                setUserSelectCripto(Object.values(user)[0]);
            }
        }
        if (market !== 'load' && Object.values(market).length !== 0) {
            setMarketSelectCripto(market[0]);
        }
    }, [market, user]);

    if (!marketSelectCripto || user === "load" || !user) {
        return (
            <div className="replenishmentPage loading">
                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
        );
    } else {
        const buttonHandler = () => {
            if (userInputPrice) {
                setIsLoading(true); // Починаємо завантаження

                convertCrypto(userSelectCripto.name, marketSelectCripto.symbol, userInputPrice)
                    .then(() => {
                        Promise.all([getListUserCrypto(), getHistory()]).then((response) => {
                            dispatch(setCryptoBalance(response[0].balanceCrypto));
                            dispatch(setHistory(response[1].userHistory));

                            showNotification('Currency purchased successfully', true);
                            setIsLoading(false);
                        }).catch(() => {
                            showNotification('Transaction failed', false);
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
            } else if ((parseFloat(value) < min) || !parseFloat(value)) {
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
                                    <CryptoForm
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
                            <CryptoForm
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
                        <LimitedMessage crypto={userSelectCripto} limitedResult={limitedInput} />
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
