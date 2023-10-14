import React, { useState } from 'react';

import "./CurrencyDropdown.css";

const CurrencyDropdown = ({ criptoList, selectedCripto, setSelectedCripto }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectCurrency = (cripto) => {
        setSelectedCripto(cripto);
        setIsDropdownOpen(false);
    };

    return (
        <div className="custom-dropdown-container">
            <div
                className="custom-dropdown-trigger"
                onClick={toggleDropdown}
            >
                {/* <img src={selectedCripto.image} alt="" /> */}
                {selectedCripto?.symbol || selectedCripto?.name}
            </div>
            <div className={`custom-dropdown-options ${isDropdownOpen ? 'open' : ''}`}>
                {Object.values(criptoList).map(option => (
                    <div
                        key={option?.symbol || option?.name}
                        className="custom-dropdown-option"
                        onClick={() => selectCurrency(option)}
                    >
                        {/* <img src={option.image} alt="" /> */}
                        {option?.symbol || option?.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrencyDropdown;
