import React from 'react';
import { BiSolidWalletAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { BsFillLayersFill } from "react-icons/bs";
import Balance from "../Balance/Balance"
import { NavLink } from "react-router-dom";

import "./Menu.css"
import CurrencyDropdown from '../CurrencyDropdown/CurrencyDropdown';

const Menu = () => {
    return (
        <div className="menu">

            <Balance />

            <div className='nav'>
                <NavLink exact to="/" activeClassName="active">
                    <div className='menu-item'>
                        <BiSolidWalletAlt />
                        <p>Wallet</p>
                    </div>
                </NavLink>

                <NavLink to="/replenishment" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <AiOutlinePlus />
                        <p>Buy crypto</p>
                    </div>
                </NavLink>
                <NavLink to="/convertation" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <LiaExchangeAltSolid />
                        <p>Exchange</p>
                    </div>
                </NavLink>
                <NavLink to="/staking" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <BsFillLayersFill />
                        <p>Staking</p>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default Menu;
