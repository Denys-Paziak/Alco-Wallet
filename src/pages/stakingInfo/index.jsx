import { useSelector,useDispatch } from 'react-redux';
import { useParams, Link } from "react-router-dom";
import { useState  } from 'react';

import { setHistory } from "../../slices/historySlice";
import { setUserStaking, setCryptoBalance } from '../../slices/userSlice';
import { unStakingCrypto, getUserStaking, getListUserCrypto, getHistory } from '../../server';

import loadImg from "./load.svg";
import arrowBack from "./arrow_back.svg";

import "./StakingInfo.css"

export default function StakingInfo() {
    const { name } = useParams();

    const staking = useSelector(state => state.staking.staking);
    const stakingUser = useSelector(state => state.user.staking);
    const crypto = useSelector(state => state.user.cryptoBalance);

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    if (staking === 'load' || stakingUser === 'load' || crypto === 'load') {
        return (
            <div className='stakingInfo'>
                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
        )
    } else {
        const data = staking.find(item => item.name === name);

        const nameUpperCase = data?.name?.toUpperCase()

        const buttonHandler = () => {
            setIsLoading(true); // Починаємо завантаження

            unStakingCrypto(name)
                .then(() => {
                    Promise.all([getUserStaking(), getListUserCrypto(), getHistory()]).then((response) => {
                        dispatch(setUserStaking(response[0].userStaking));
                        dispatch(setCryptoBalance(response[1].balanceCrypto));
                        dispatch(setHistory(response[2].userHistory));

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

        return (
            <div className='stakingInfo'>
                <Link to="/staking" className='back'>
                    <img src={arrowBack} alt="" />
                </Link>
                <div className='content'>
                    <img src={data?.image} alt="" />
                    <h4><span>{nameUpperCase}</span>  staking</h4>
                    <p className='yearly'>+{Object.values(data?.validators)[0]} Yearly yield</p>
                    <div className='infoList'>
                        <div className="info">
                            <p className='indicator'>Total</p>
                            <p className='total'>{(parseFloat(stakingUser?.[name]?.total || 0) + parseFloat(crypto?.[name]?.total)) || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Available</p>
                            <p className='total'>{crypto?.[name]?.total || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Staked</p>
                            <p className='total'>{stakingUser?.[name]?.total || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Rewards</p>
                            <p className='total'>{(stakingUser?.[name]?.result - stakingUser?.[name]?.total) || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Unbounding</p>
                            <p className='total'>{stakingUser?.[name]?.result || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                    </div>
                    <div className='buttonsStake'>
                        <Link to={"stake"}>
                            <button className='stakeCrypto'>Stake {nameUpperCase}</button>
                        </Link>
                        <button className={"crypto-form__button unstake" + (isLoading ? " disablet" : "")}
                            onClick={buttonHandler}
                            disabled={isLoading} // Вимикаємо кнопку під час завантаження
                        >
                            {isLoading ? 'Loading...' : 'Unstake'}
                        </button>
                    </div>
                </div>
                <div className='sideButtons'>
                    <button className='sideStake'>Stake</button>
                    <button className='sideRedelegate'>Redelegate</button>
                    <button className='sideClaim'>Claim</button>
                </div>
                {notification && (
                    <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                        {notification.message}
                    </div>
                )}
            </div>
        )
    }
}