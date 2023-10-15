import React, { useState } from 'react';

import "./CurrencyDropdown.css";

const CurrencyDropdown = ({ criptoList, selectedCripto, setSelectedCripto }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectCurrency = (cripto) => {
        setSelectedCripto(cripto);
        setIsDropdownOpen(false);
    };

    return (
        <div className="custom-dropdown-container">
            <div className="custom-dropdown-trigger" onClick={toggleDropdown}>
                {selectedCripto?.symbol || selectedCripto?.name}
            </div>
            <div className={`custom-dropdown-options ${isDropdownOpen ? 'open' : ''}`}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {Object.values(criptoList)
                    .filter(option => {
                        const name = option?.name || "";
                        const symbol = option?.symbol || "";
                        return name.includes(searchText) || symbol.includes(searchText);
                    })
                    .map(option => (
                        <div
                            key={option?.symbol || option?.name}
                            className="custom-dropdown-option"
                            onClick={() => selectCurrency(option)}
                        >
                            {option?.symbol || option?.name}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CurrencyDropdown;
