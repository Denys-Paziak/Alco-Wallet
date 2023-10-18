import { Link, useLocation } from "react-router-dom";

import arrowBack from "./arrow_back.svg";
import CriptoForm from "../../Components/CryptoForm/CriptoForm";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CurrencyDropdown from '../../Components/CurrencyDropdown/CurrencyDropdown';

import { setStaking } from "../../slices/stakingSlice";
import { getUserStaking, stakingCrypto } from '../../server';


export default function StakedPage() {
    const pathname = useLocation().pathname.split('/');

    const [totalStake, setTotalStake] = useState(100);
    
    const [userSelectCripto, setUserSelectCripto] = useState(null);
    const [userSelectCriptoPushServer, setUserCriptoPushServer] = useState(null);
    
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [validators, setValidators] = useState([]);

    const dispatch = useDispatch();

    const market = useSelector(state => state.market.market);
    const staking = useSelector(state => state.staking.staking);

    useEffect(() => {
        console.log(staking);
        if (staking !== 'load' && staking) {
            const stakingMarket = staking.find(item => item.name === pathname[2])

            const arrValidators = Object.entries(stakingMarket.validators).map(item => {
                return {
                    name: item[0] + " " + item[1]
                }
            });

            const selectIndexValidator = arrValidators.findIndex(item => (userSelectCripto || arrValidators[0]).name.includes(item.name));

            setUserCriptoPushServer(Object.entries(stakingMarket.validators)[selectIndexValidator][0]);


            setValidators(arrValidators);
            setUserSelectCripto(arrValidators[0]);
        }
    }, [staking]);

    if (market === 'load' && staking === 'load') {
        return (
            <div className="staked">
                <Link to={"/staking/" + pathname[2]} className='back'>
                    <img src={arrowBack} alt="" />
                </Link>

                <div className='crypto-form'>
                    Loading...
                </div>
            </div>
        );
    } else {

        const buttonHandler = () => {
            setIsLoading(true); // Починаємо завантаження

            stakingCrypto(pathname[2], totalStake, userSelectCriptoPushServer)
                .then(() => {
                    getUserStaking().then((data) => {
                        dispatch(setStaking(data.balance));
                        showNotification('Currency purchased successfully', true);
                    });
                })
                .catch(() => {
                    showNotification('Transaction failed', false);
                })
                .finally(() => {
                    setIsLoading(false); // Закінчили завантаження (незалежно від результату)
                });
        };

        const showNotification = (message, isSuccess) => {
            setNotification({ message, isSuccess });
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        };

        return (
            <div className="staked">
                <Link to={"/staking/" + pathname[2]} className='back'>
                    <img src={arrowBack} alt="" />
                </Link>

                <div className='crypto-form'>
                    <div className="left">
                        <div className="row">
                            <CriptoForm inputHandler={setTotalStake} inputValue={totalStake} />
                            <CurrencyDropdown
                                criptoList={validators}
                                selectedCripto={userSelectCripto}
                                setSelectedCripto={setUserSelectCripto} />
                        </div>
                    </div>
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
}