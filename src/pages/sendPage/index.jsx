import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clipboardCopy from 'clipboard-copy';

import { setCryptoBalance } from "../../slices/userSlice";
import { setHistory } from "../../slices/historySlice";
import { send, getHistory, getListUserCrypto } from '../../server';

import CryptoForm from "../../Components/CryptoForm/CryptoForm";

import loadImg from "./load.svg";

import "./Send.css"

export default function StakedPage() {
    const {name} = useParams();

    const user = useSelector(state => state.user.cryptoBalance);
    const market = useSelector(state => state.market.market);

    const [totalStake, setTotalStake] = useState(0);
    const [addresses, setAddresses] = useState('');

    const [userSelectCripto, setUserSelectCripto] = useState('load');

    const [limitedInput, setLimitedInput] = useState('min');

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (market !== 'load') {
            const userCrypto = market.find(item => item.name === name);

            setUserSelectCripto(userCrypto);
        }
    }, [market]);

    if (userSelectCripto === 'load'|| user === 'load') {
        return (
            <div className="staked">
                <div className='crypto-form'>
                    <div className='loadBlock'>
                        <img className='loadImg' src={loadImg} alt="" />
                        <p className='loadText'>Loading...</p>
                    </div>
                </div>
            </div>
        );
    } else {
        const cryptoUs = user[userSelectCripto.symbol];

        const buttonHandler = () => {
            setIsLoading(true); // Починаємо завантаження

            send(userSelectCripto.symbol, totalStake, addresses)
                .then(() => {
                    Promise.all([getHistory(), getListUserCrypto()]).then((response) => {
                        dispatch(setHistory(response[0].userHistory));
                        dispatch(setCryptoBalance(response[1].balanceCrypto));

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
        };

        const showNotification = (message, isSuccess) => {
            setNotification({ message, isSuccess });
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        };

        function limitedValidator(value) {
            if (cryptoUs) {
                const max = parseFloat(cryptoUs.total) ;
                const min = (10 / userSelectCripto.price).toFixed(4);

                if (parseFloat(value) > max) {
                    setLimitedInput("max");
                } else if ((parseFloat(value) < min) || !parseFloat(value)) {
                    setLimitedInput("min");
                } else {
                    setLimitedInput("value");
                }
            } else {
                setLimitedInput("max");
            }
        }

        function onSendAll() {
            if (cryptoUs) {
                setTotalStake(cryptoUs.total);
                setLimitedInput("value");
            }
        }

        function onClipboard() {
            const text = navigator.clipboard?.readText();
      
            text.then((data) => {
                setAddresses(data)
            })
        }

        return (
            <div className="send">
                <div className="limit">
                    <div className="top">
                        <div className="title">
                            <img className="imgCrypto" src={userSelectCripto.image} alt="" />
                            <p className="nameCrypto">Send {userSelectCripto.name}<span className="symbol">({userSelectCripto.symbol.toUpperCase()})</span></p>
                        </div>
                        <div className='crypto-form'>
                            <p className={!addresses ? "clipboard" : "cliced"} onClick={onClipboard}>Click here to paste address or domain</p>
                            <div className="input" style={{marginBottom: 20}}>
                                <CryptoForm
                                    inputHandler={setAddresses}
                                    inputValue={addresses}
                                    testRegular={false}
                                     />
                            </div>
                            <p>Amount</p>
                            <div className="input">
                                <CryptoForm
                                    inputHandler={setTotalStake}
                                    inputValue={totalStake}
                                    limitedValidator={limitedValidator} />
                                <p>{userSelectCripto.symbol.toUpperCase()}</p>

                                <div className="toDolar">
                                    <p className="price">{totalStake * userSelectCripto.price}</p>
                                    <p className="symbol">USD</p>
                                </div>
                            </div>

                            {
                                limitedInput === 'max'
                                ?
                                <div className="messageMax">
                                    <p className="text">Amount can't be blank</p>
                                    <Link to='/replenishment' className="btn">Buy {userSelectCripto.symbol.toUpperCase()}</Link>
                                </div>
                                :
                                null
                            }

                            <div className="available">
                                <div className="conteiner">
                                    <p className="text">Available:</p>

                                    {
                                        cryptoUs
                                        ?
                                        <>
                                            <p className="crypto">{cryptoUs.total} {userSelectCripto.symbol.toUpperCase()}</p>
                                            <p className="dolar">{cryptoUs.total * userSelectCripto.price} USD</p>
                                        </>
                                        :
                                        <>
                                            <p className="crypto">0 {userSelectCripto.symbol.toUpperCase()}</p>
                                            <p className="dolar">0 USD</p>
                                        </>
                                    }
                                </div>
                                <div className="button" onClick={onSendAll}>
                                    <p>Send All</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        {
                            limitedInput === 'min'
                            ?
                            <p className="messageMin">You should have at least {(10 / userSelectCripto.price).toFixed(4)} {userSelectCripto.symbol.toUpperCase()} to send {userSelectCripto.symbol.toUpperCase()}</p>
                            :
                            null
                        }

                        <button style={{width: 300}} className={"crypto-form__button" + ((isLoading || (limitedInput !== "value")) ? " disablet" : "")}
                            onClick={buttonHandler}
                            disabled={isLoading || (limitedInput !== "value")} // Вимикаємо кнопку під час завантаження
                        >
                            {isLoading ? 'Loading...' : `Send ${userSelectCripto.symbol.toUpperCase()}`}
                        </button>
                    </div>
                    {notification && (
                        <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                            {notification.message}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}