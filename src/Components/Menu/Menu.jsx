import React from 'react';
import { BiSolidWalletAlt } from "react-icons/bi";
import { AiOutlinePlus, AiOutlineHistory } from "react-icons/ai";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { BsFillLayersFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import Balance from "../Balance/Balance"
import { NavLink } from "react-router-dom";

import depositImg from "./deposit.svg"

import "./Menu.css"

const Menu = () => {
    return (
        <div className="menu">

            <Balance />

            <div className='nav'>
                <NavLink to="/" activeClassName="active">
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
                <NavLink to="/deposit" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <img style={{width: 20}} src={depositImg} alt="" />
                        <p>Deposit</p>
                    </div>
                </NavLink>
                <NavLink to="/history" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <AiOutlineHistory />
                        <p>History</p>
                    </div>
                </NavLink>
                <NavLink to="/settings" activeClassName="active">
                    <div className='menu-item flex items-center gap-5'>
                        <FiSettings />
                        <p>Settings</p>
                    </div>
                </NavLink>
               
            </div>
        </div>
    );
};

export default Menu;
