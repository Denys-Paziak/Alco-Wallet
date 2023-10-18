import React from 'react';

const CriptoForm = ({ readOnly, inputHandler, inputValue, limitedValidator}) => {
    const handleChange = (e) => {
        if (!readOnly) {
            const testRegular = /^\d*(\.\d{0,18})?$/g.test(e.target.value);

            limitedValidator(e.target.value);

            inputHandler((state) => {
                if (testRegular) {
                    return e.target.value;
                } else {
                    return state;
                }
            });
        }
    };

    return (
        <input
            type="text"
            className="crypto-form__input"
            onChange={handleChange}
            value={inputValue}
            readOnly={readOnly}
        />
    );
};

export default CriptoForm;
