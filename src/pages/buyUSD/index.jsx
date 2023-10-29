import React, { useState, useEffect } from 'react';
import "./style.css";
import { buyUSD, getBalance, getHistory } from '../../server';
import { useDispatch } from 'react-redux';
import { setUSDBalance } from '../../slices/userSlice';
import { setHistory } from '../../slices/historySlice';

function BuyUsdForm() {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [message, setMessage] = useState(''); // Доданий стан для повідомлень про статус

    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const showNotification = (message, isSuccess) => {
        setNotification({ message, isSuccess });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    useEffect(() => {
        setIsSubmitDisabled(!isFormValid());
    }, [amount, name, email, cardNumber, expiryDate, cvv]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0 && isFormValid() && !isLoading) {
            setIsLoading(true);
            setMessage('Sending data to the server...');
            buyUSDHandler();
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            errors.amount = 'Please enter a valid amount greater than 0.';
        }

        if (!name.trim()) {
            errors.name = 'Please enter your name.';
        }

        if (!email.trim() || !isValidEmail(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!cardNumber.trim() || !isValidCardNumber(cardNumber)) {
            errors.cardNumber = 'Please enter a valid card number.';
        }

        if (!expiryDate.trim() || !isValidExpiryDate(expiryDate)) {
            errors.expiryDate = 'Please enter a valid expiry date (MM/YY).';
        }

        if (!cvv.trim() || !isValidCVV(cvv)) {
            errors.cvv = 'Please enter a valid 3-digit CVV code.';
        }

        return errors;
    };

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const isValidCardNumber = (value) => {
        return /^[0-9]{16}$/.test(value);
    };

    const isValidExpiryDate = (value) => {
        // Додайте власну логіку перевірки дати (MM/YY) тут
        return true;
    };

    const isValidCVV = (value) => {
        return /^[0-9]{3}$/.test(value);
    };

    const handleCardNumberChange = (e) => {
        const inputCardNumber = e.target.value;
        const formattedCardNumber = inputCardNumber.replace(/\D/g, '').slice(0, 16);
        setCardNumber(formattedCardNumber);
    };

    const handleExpiryDateChange = (e) => {
        let inputExpiryDate = e.target.value;
        let formattedExpiryDate = inputExpiryDate.replace(/\D/g, '').slice(0, 4);

        if (formattedExpiryDate.length >= 2) {
            let formattedMM = formattedExpiryDate.slice(0, 2);
            let formattedYY = formattedExpiryDate.slice(2);
            formattedExpiryDate = formattedMM + '/' + formattedYY;
        }

        setExpiryDate(formattedExpiryDate);
    };

    const handleCvvChange = (e) => {
        const inputCvv = e.target.value;
        const formattedCvv = inputCvv.replace(/\D/g, '').slice(0, 3);
        setCvv(formattedCvv);
    };

    const isFormValid = () => {
        return amount.length > 0 && name.length > 0 && email.length > 0 && cardNumber.length > 0 && expiryDate.length > 0 && cvv.length > 0;
    };

    const buyUSDHandler = () => {
        setIsLoading(true);
        buyUSD(amount)
            .then((response) => {
                Promise.all([getBalance(), getHistory()]).then(response => {
                    dispatch(setUSDBalance(response[0].balance));
                    dispatch(setHistory(response[1].userHistory));

                    showNotification('Purchase successful.', true);
                    setIsLoading(false);
                }).catch((error) => {
                    showNotification('Purchase failed.', false);
                    setIsLoading(false);
                })
            }).catch((error) => {
                showNotification('Purchase failed.', false);
                setIsLoading(false);
            })
            .finally(() => { });
    }

    return (
        <div className="buy-usd-form">
            <h2>Form for buying USD</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Amount you want to buy (USD):
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    {errors.amount && <span className="error">{errors.amount}</span>}
                </label>

                <label>
                    Your name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                    Your email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {errors.email && <span className="error">{errors.email}</span>}
                </label>

                <label>
                    Bank card number:
                    <input type="text" value={cardNumber} onChange={handleCardNumberChange} maxLength="16" required />
                    {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                </label>

                <label>
                    Card expiration date (MM/YY):
                    <input type="text" value={expiryDate} onChange={handleExpiryDateChange} maxLength="5" placeholder="MM/YY" required />
                    {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
                </label>

                <label>
                    CVV code:
                    <input type="text" value={cvv} onChange={handleCvvChange} maxLength="3" required />
                    {errors.cvv && <span className="error">{errors.cvv}</span>}
                </label>


                {message && <div className="message">{message}</div>}
            </form>

            <button type="submit" onClick={buyUSDHandler} className={isSubmitDisabled || isLoading ? 'disabled' : ''} disabled={isSubmitDisabled || isLoading}>
                {isLoading ? 'Sending...' : 'Confirm Purchase'}
            </button>
            {notification && (
                <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default BuyUsdForm;
