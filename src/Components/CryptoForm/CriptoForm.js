import React from 'react';

const CriptoForm = ({ readOnly, inputHandler, inputValue }) => {
    const handleChange = (e) => {
        if (!readOnly) {
            // Видаляємо всі символи, крім цифр
            const numericValue = e.target.value.replace(/\D/g, '');
            // Викликаємо обробник inputHandler з очищеним числовим значенням
            inputHandler(numericValue);
        }
    };

    return (
        <form className="form">
            <input
                type="text"
                className="crypto-form__input"
                onChange={handleChange}
                value={inputValue}
                readOnly={readOnly}
            />
        </form>
    );
};

export default CriptoForm;
