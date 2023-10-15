import { useSelector } from 'react-redux';
import CryptoChart from '../../Components/CryptoChart/CryptoChart';
import { NavLink } from "react-router-dom";

import "./MainPage.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
);

const labels = ['', '', '', '', '', '', ''];

export default function MainPage() {
    const market = useSelector(state => state.market.market);
    const cryptoBalance = useSelector(state => state.user.cryptoBalance);
    const chart7DaysAllCrypto = useSelector(state => state.chart.chart7DaysAllCrypto);

    return (
        <div>
            <div className="table-item table-title">
                <p className='table-item__search'>Search</p>
                <p className='table-item__balance'>Balance</p>
                <p className='table-item__value'>Value</p>
                <p className='table-item__price'>Price</p>
                <p className='table-item__24h'>24h</p>
                <p className='table-item__portfolio'>Portfolio</p>
                <p className='table-item__mCap'>M. cap</p>
                <p className='table-item__chart'>7 days chart</p>
            </div>


            {0 ? (
                <p className="table-item text-gray-400 text-lg font-semibold">Loading...</p>
            ) : (
                market.map((crypto, index) => {
                    const statusStyle = parseFloat(crypto.change) < 0 ? 'red' : 'green';

                    let name;

                    if (crypto.name.length > 9) {
                        name = crypto.name.slice(0, 9) + "...";
                    } else {
                        name = crypto.name;
                    }

                    return (
                        <NavLink key={crypto.id} to={`${crypto.name}`} className="table-item">
                            <div className='table-item__search'>
                                <img className='table-item__icon' src={crypto.image} alt='icon' />
                                <p>{name}</p>
                            </div>
                            <div className='table-item__balance'>
                                <span className='total'>{cryptoBalance?.[crypto.symbol]?.total || 0} </span>
                                <span className='symbol'>{crypto.symbol.toUpperCase()}</span>
                            </div>
                            <p className='table-item__value'>{ }</ p>
                            <p className='table-item__price'>${crypto.price}</p>
                            <p className={`table-item__24h ${statusStyle}`}>{crypto.change.toFixed(2)}</p>
                            <p className='table-item__portfolio'></p>
                            <p className='table-item__mCap'>{crypto.MCap || 0}</p>
                            <div className='table-item__chart'>
                                <CryptoChart chartData={{
                                    labels,
                                    datasets: [
                                        {
                                            label: 'Dataset 4',
                                            data: chart7DaysAllCrypto?.[crypto.name]?.map(el => el.price),
                                            borderColor: 'rgb(53, 162, 2325)',
                                            fill: false,
                                        },
                                    ],

                                }} />
                            </div>
                        </NavLink>
                    );
                })
            )}
        </div>
    );
}