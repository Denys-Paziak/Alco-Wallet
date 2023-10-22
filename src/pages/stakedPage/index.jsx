import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setUserStaking, setCryptoBalance } from "../../slices/userSlice";
import { setHistory } from "../../slices/historySlice";
import { getUserStaking, stakingCrypto, getHistory, getListUserCrypto } from '../../server';

import CryptoForm from "../../Components/CryptoForm/CryptoForm";
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';

import loadImg from "./load.svg";
import arrowBack from "./arrow_back.svg";

import "./Staked.css"

export default function StakedPage() {
    const pathname = useLocation().pathname.split('/');

    const user = useSelector(state => state.user.cryptoBalance);
    const staking = useSelector(state => state.staking.staking);
    const market = useSelector(state => state.market.market);

    const [totalStake, setTotalStake] = useState(0);

    const [userSelectCripto, setUserSelectCripto] = useState('load');

    const [validators, setValidators] = useState([]);
    const [selectValidator, setSelectValidator] = useState(null);
    const [selectValidatorPushServer, setSelectValidatorPushServer] = useState(null);

    const [limitedInput, setLimitedInput] = useState('min');

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (staking !== 'load') {
            const stakingMarket = staking.find(item => item.name === pathname[2])

            const arrValidators = Object.entries(stakingMarket.validators).map(item => {
                return {
                    name: item[0] + " - " + item[1] + "%"
                }
            });

            const selectIndexValidator = arrValidators.findIndex(item => (selectValidator || arrValidators[0]).name.includes(item.name));

            setValidators(arrValidators);
            setSelectValidator(arrValidators[0]);
            setSelectValidatorPushServer(Object.entries(stakingMarket.validators)[selectIndexValidator][0]);
        }

        if (market !== 'load') {
            const userCrypto = market.find(item => item.symbol === pathname[2]);

            setUserSelectCripto(userCrypto);
        }
    }, [staking, market]);

    if (userSelectCripto === 'load' || staking === 'load' || user === 'load') {
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
        const buttonHandler = () => {
            setIsLoading(true); // Починаємо завантаження

            stakingCrypto(pathname[2], totalStake, selectValidatorPushServer)
                .then(() => {
                    Promise.all([getUserStaking(), getHistory(), getListUserCrypto()]).then((response) => {
                        dispatch(setUserStaking(response[0].userStaking));
                        dispatch(setHistory(response[1].userHistory));
                        dispatch(setCryptoBalance(response[2].balanceCrypto));

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
            if (user[pathname[2]]) {
                const max = parseFloat(user[pathname[2]].total) ;
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
            if (user[pathname[2]]) {
                setTotalStake(user[pathname[2]].total);
                setLimitedInput("value");
            }
        }

        return (
            <div className="staked">
                <Link to={"/staking/" + pathname[2]} className='back'>
                    <img src={arrowBack} alt="" />
                </Link>

                <div className="limit">
                    <div className="top">
                        <img className="imgCrypto" src={userSelectCripto.image} alt="" />
                        <p className="nameCrypto">Stake {userSelectCripto.name}</p>
                        <div className='crypto-form'>
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
                                        user[pathname[2]]
                                        ?
                                        <>
                                            <p className="crypto">{user[pathname[2]].total} {userSelectCripto.symbol.toUpperCase()}</p>
                                            <p className="dolar">{user[pathname[2]].total * userSelectCripto.price} USD</p>
                                        </>
                                        :
                                        <>
                                            <p className="crypto">0 {userSelectCripto.symbol.toUpperCase()}</p>
                                            <p className="dolar">0 USD</p>
                                        </>
                                    }
                                </div>
                                <div className="button" onClick={onSendAll}>
                                    <p>Stake All</p>
                                </div>
                            </div>

                            <div className="validatorSelect">
                                <span>Validator:  </span>
                                <CurrencyDropdown
                                    list={validators}
                                    selected={selectValidator}
                                    setSelected={setSelectValidator} />
                                <span> yearly yield</span>
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

                        <button className={"crypto-form__button" + ((isLoading || (limitedInput !== "value")) ? " disablet" : "")}
                            onClick={buttonHandler}
                            disabled={isLoading || (limitedInput !== "value")} // Вимикаємо кнопку під час завантаження
                        >
                            {isLoading ? 'Loading...' : `Stake ${userSelectCripto.symbol.toUpperCase()}`}
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