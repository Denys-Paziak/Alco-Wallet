import React, { useState } from 'react';

import "./CurrencyDropdown.css";

const CurrencyDropdown = ({ list, selected, setSelected }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectCurrency = (cripto) => {
        setSelected(cripto);
        setIsDropdownOpen(false);
    };

    return (
        <div className="custom-dropdown-container validator">
            <div className="custom-dropdown-trigger" onClick={toggleDropdown}>
                {selected?.symbol || selected?.name}
            </div>
            <div className={`custom-dropdown-options ${isDropdownOpen ? 'open' : ''}`}>
                <input className='drop'
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {Object.values(list)
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
