import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import "./style.css";
import clipboardCopy from 'clipboard-copy';

const Receive = () => {
    const { name } = useParams();
    const btcAddress = '1Kcyt1p3CZgs2tyDe4NJmVKsJjUmxS2GPR';
    const [text, setText] = useState()

    const handleCopyClick = () => {
        clipboardCopy(btcAddress)
            .then(() => {
                setText("Text copied successfully");
            })
            .catch((error) => {
                console.error('Failed to copy: ', error);
            });
    };

    return (
        <div className='receive'>
            <h2>{name}</h2>
            <p>Your BTC Address</p>
            <img src="/qrCode.png" alt="" />
            <p className='payer'>{btcAddress}</p>
            <button className='copy' onClick={handleCopyClick}>Copy</button>
            <p className='green'>{text}</p>
        </div>
    );
}

export default Receive;
