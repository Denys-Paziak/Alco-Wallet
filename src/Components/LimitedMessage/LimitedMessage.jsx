import { Link } from 'react-router-dom';

export default function LimitedMessage({crypto, limitedResult}) {
    switch (limitedResult) {
        case "max":
            return (
                <p className='crypto-form__text'>
                    <span style={{ marginRight: 10 }}>To make this exchange, deposit more {crypto.name.toUpperCase()} to your wallet</span>
                    <Link to='/replenishment' className='buy'>Buy {crypto.name.toUpperCase()}</Link>
                </p>
            )
        case "min":
            return (
                <p className='crypto-form__text'>
                    <span style={{ marginRight: 5 }}>The minimum amount for exchange is</span>
                    <span style={{ marginRight: 10 }}>{(10 / (crypto.courseOnCrypto || crypto.price)).toFixed(4)} {crypto.name.toUpperCase()}</span>
                    <Link to='/replenishment' className='buy'>Buy {crypto.name.toUpperCase()}</Link>
                </p>
            )
        default:
            return (
                <p className='crypto-form__text'>
                    <span style={{ color: "#00cb07" }}>All ready for conversion</span>
                </p>
            )
    }
}