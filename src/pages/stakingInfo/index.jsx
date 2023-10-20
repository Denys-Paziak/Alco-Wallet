import { useSelector } from 'react-redux';
import { useParams, Link } from "react-router-dom";

import arrowBack from "./arrow_back.svg";

import "./StakingInfo.css"

export default function StakingInfo() {
    const { name } = useParams();

    const staking  = useSelector(state => state.staking.staking);
    const stakingUser  = useSelector(state => state.user.staking);
    const crypto  = useSelector(state => state.user.cryptoBalance);

    if (staking === 'load' || stakingUser === 'load' || crypto === 'load') {
        return (
            <div className='stakingInfo'>
                <Link to="/staking" className='back'>
                    <img src={arrowBack} alt="" />
                </Link>
                <div className='content'>
                    Loading...
                </div>
                <div className='sideButtons'>
                    <button className='sideStake'>Stake</button>
                    <button className='sideRedelegate'>Redelegate</button>
                    <button className='sideClaim'>Claim</button>
                </div>
            </div>
        )
    } else {
        const data = staking.find(item => item.name === name);

        const nameUpperCase = data?.name?.toUpperCase()
    
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
                            <p className='total'>{crypto?.[name]?.total || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Available</p>
                            <p className='total'>{(crypto?.[name]?.total - stakingUser?.[name]?.total) || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Staked</p>
                            <p className='total'>{stakingUser?.[name]?.total || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Rewards</p>
                            <p className='total'>{stakingUser?.[name]?.rewards || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                        <div className="info">
                            <p className='indicator'>Unbounding</p>
                            <p className='total'>{(parseFloat(stakingUser?.[name]?.total) + parseFloat(stakingUser?.[name]?.rewards)) || 0}</p>
                            <p className='nameCrypto'>{nameUpperCase}</p>
                        </div>
                    </div>
                    <div className='buttonsStake'>
                        <Link to={"stake"}>
                            <button className='stakeCrypto'>Stake {nameUpperCase}</button>
                        </Link>
                        <button className='unstake'>Unstake</button>
                    </div>
                </div>
                <div className='sideButtons'>
                    <button className='sideStake'>Stake</button>
                    <button className='sideRedelegate'>Redelegate</button>
                    <button className='sideClaim'>Claim</button>
                </div>
            </div>
        )
    }
}