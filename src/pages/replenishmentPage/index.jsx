import React, { useEffect, useState } from 'react';
import { buyCrypto, getListUserCrypto, getBalance } from '../../server';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setCryptoBalance, setUSDBalance } from "../../slices/userSlice";

import CriptoForm from "../../Components/CryptoForm/CriptoForm";

import arrow from "./arrow.svg";
import checkImg from "./check.svg";
import { BsArrowRight } from "react-icons/bs";
import formatDate from '../../function/convertDate';

const tabsData = ["Instant Exchange", "Order History"]

export default function ReplenishmentPage() {
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
    const history = useSelector(state => state.history.historyBuy);
    console.log(history);
    return (
        <div className="history-container">
            {history.map(el => {
                return (

                    <div className="history-item">
                        <div className="row">
                            <div className="history-item__type">{formatDate(el.date)}</div>
                            <div className="history-item__date"></div>
                        </div>
                        <div className="row">
                            <div className="history-item__from">{el.body.total} USD</div>
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
}

const InstantExchange = () => {
    const user = useSelector(state => state.user.USDBalance);
    const market = useSelector(state => state.market.market);

    const [userSelectCripto, setUserSelectCripto] = useState({ symbol: "usd", image: "/USD.png" });
    const [marketSelectCripto, setMarketSelectCripto] = useState(null);

    const [marketInputPrice, setMarketInputPrice] = useState(0);
    const [userInputPrice, setUserInputPrice] = useState(0);

    const [check, setCheck] = useState(false);
    const [limitedInput, setLimitedInput] = useState('min');

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    const dispatch = useDispatch();

    useEffect(() => {
        if (userSelectCripto && marketSelectCripto) {
            const marketCripto = market.find(el => el.symbol === marketSelectCripto.symbol);

            setMarketInputPrice(userInputPrice / marketCripto.price);
        }
    }, [userSelectCripto, marketSelectCripto, userInputPrice]);

    useEffect(() => {
        if (market !== 'load') {
            setMarketSelectCripto(market[0]);
        }
    }, [market]);


    if (!marketSelectCripto || user === 'load') {
        return (
            <div className="replenishmentPage loading">
                Loading...
            </div>
        );
    } else {
        const buttonHandler = () => {
            if (userInputPrice) {
                setIsLoading(true); // Починаємо завантаження

                buyCrypto(marketSelectCripto.symbol, userInputPrice)
                    .then(() => {
                        getBalance().then((data) => {
                            dispatch(setUSDBalance(data.balance));
                        });
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
            setLimitedInput("value");
            setUserInputPrice(user);
        }

        function limitedValidator(value) {
            const max = parseFloat(userSelectCripto);
            const min = 1;

            if (parseFloat(value) > max) {
                setLimitedInput("max");
            } else if (parseFloat(value) < min) {
                setLimitedInput("min");
            } else {
                setLimitedInput("value");
            }
        }

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
                                list={market}
                                selected={marketSelectCripto}
                                setSelected={setMarketSelectCripto} />
                        </div>
                        <p className="reward-text">Reward: {marketInputPrice * 0.0303954} TRD</p>
                    </div>
                </div>
                <div className='infoText'>
                    <p> 5% fees (min 10 USD) are included in the price</p>
                    <p>The average delivery time is 10 to 30 minutes</p>
                </div>
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
}
