import React from 'react';

const CriptoForm = ({ readOnly, inputHandler, inputValue, limitedValidator}) => {
    const handleChange = (e) => {
        if (!readOnly) {
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
        }
    };

    return (
        <input
            type="text"
            className="crypto-form__input border"
            onChange={handleChange}
            value={inputValue}
            readOnly={readOnly}
        />
    );
};

export default CriptoForm;
