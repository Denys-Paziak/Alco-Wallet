import { useSelector } from 'react-redux';

import { NavLink } from 'react-router-dom';

import "./Balance.css";


const Balance = () => {
    const USDBalance = useSelector(state => state.user.USDBalance);

    return (
        <div className="balance">
            <img src='/logo.svg' alt='' />
            <p className='balance__title'>Algo Wallet</p>
            <NavLink to="/buyUSD" activeClassName="active">
                <h2 className='balance__total'>{USDBalance}</h2>
            </NavLink>

        </div>
    );
};

export default Balance;
