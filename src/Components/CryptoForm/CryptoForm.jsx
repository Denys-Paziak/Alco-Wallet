import React from 'react';

const CryptoForm = ({ readOnly, inputHandler, inputValue, limitedValidator, testRegular = true}) => {
    const handleChange = (e) => {
        if (!readOnly) {
            if (testRegular) {
                const testRegular = /^(\d+\.{0,1}|\d*)(\d{0,18})?$/g.test(e.target.value);

                inputHandler((state) => {
                    if (testRegular) {
                        limitedValidator(e.target.value);
                        return e.target.value;
                    } else {
                        limitedValidator(state);
                        return state;
                    }
                });
            } else {
                inputHandler(e.target.value)
            }
            
        }
    };

    return (
        <input
            type="text"
            className="crypto-form__input border width"
            onChange={handleChange}
            value={inputValue}
            readOnly={readOnly}
        />
    );
};

export default CryptoForm;
