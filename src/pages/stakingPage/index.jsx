import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import loadImg from "./load.svg";
import arrow from "./arrow.svg";

import "./Staking.css";

export default function StakingPage () {
    const staking  = useSelector(state => state.staking.staking);

    let renderElement = null;

    if (staking === 'load') {
        renderElement = <div className='loadBlock'>
                            <img className='loadImg' src={loadImg} alt="" />
                            <p className='loadText'>Loading...</p>
                        </div>
    } else {
        renderElement = staking.map((item) => {
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

    return (
        <div className='staking'>
            <h2>Stake and earn</h2>
            <h3>Earn passive income from your crypto by staking it. Your crypto will remain under your full control, while also helping support the blockchain and earning you regular rewards.</h3>
            <div className='explanation'>
                <div className='stage'>
                    <p className='titleStage'>Stake coins to validator</p>
                    <p className='available'>Available $1000</p>
                    <p className='stakedStage'>Staked $0</p>
                </div>
                <img className='arrow' src={arrow}/>
                <div className='stage'>
                    <p className='titleStage'>Validator creates blocks</p>
                    <p className='available'>Available $0</p>
                    <p className='stakedStage'>Staked $1000</p>
                </div>
                <img className='arrow' src={arrow}/>
                <div className='stage'>
                    <p className='titleStage'>You receieve rewards</p>
                    <p className='available'>Staked $1000</p>
                    <p className='stakedStage'>Rewards $230</p>
                </div>
            </div>
            <div className='crypto'>
                {renderElement}
            </div>
        </div>
    );
};