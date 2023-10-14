import React, { useState } from 'react';
import { buyUSD } from '../../server';


const BuyUSD = () => {
    const [total, setTotal] = useState();

    const handler = () => {
        buyUSD(total);
    }

    return (
        <div className='flex items-center justify-center h-screen gap-5'>
            <form>
                <input type="text" onChange={(e) => { setTotal(e.target.value) }} />
            </form>
            <button onClick={handler}>BUY</button>
        </div>
    );
};

export default BuyUSD;