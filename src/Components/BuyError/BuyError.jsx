import React from 'react'
import { NavLink } from 'react-router-dom';

import "./BuyError.css";

export const BuyError = () => {
    return <div className='buyError'>
        <p>Your transaction history will appear here
            To see your new transactions, please click update.</p>
        <img src="/buyImage.png" alt="buyImage" />
        <NavLink to="/replenishment">
            <button>
                Buy bitcoin
            </button>
        </NavLink>
    </div>
}
