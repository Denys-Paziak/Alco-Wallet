import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getStakingCrypto} from "../../server";
import {setStaking} from "../../slices/stakingSlice";
import { Link } from "react-router-dom";

import "./Staking.css";

import arrow from "./arrow.svg"

const StakingPage = () => {
    const staking  = useSelector(state => state.staking.staking);

    const dispatch = useDispatch();

    console.log(staking);

    return (
        <div className='staking'>
            <h2>Stake and earn</h2>
            <h3>Earn passive income from your crypto by staking it. Your crypto will remain under your full control, while also helping support the blockchain and earning you regular rewards.</h3>
            <div className='explanation'>
                <div className='stage'>
                    <p className='titleStage'>Stake coins to validator</p>
                    <p className='available'>Available $1000</p>
                    <p className='staked'>Staked $0</p>
                </div>
                <img className='arrow' src={arrow}/>
                <div className='stage'>
                    <p className='titleStage'>Validator creates blocks</p>
                    <p className='available'>Available $0</p>
                    <p className='staked'>Staked $1000</p>
                </div>
                <img className='arrow' src={arrow}/>
                <div className='stage'>
                    <p className='titleStage'>You receieve rewards</p>
                    <p className='available'>Staked $1000</p>
                    <p className='staked'>Rewards $230</p>
                </div>
            </div>
            <div className='crypto'>
                {
                    staking.map((item) => {
                        return (
                            <div key={item.id} className='cryptoCard'>
                                <Link to={`${item.name}`} className="link">
                                    <img src={item.image} alt="" />
                                    <h4>{item.name.toUpperCase()}</h4>
                                    <p>{Object.values(item.validators)[0]}%</p>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default StakingPage;