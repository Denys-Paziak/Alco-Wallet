import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CryptoForm from "../../Components/CryptoForm/CryptoForm";
import { setHistory } from "../../slices/historySlice";
import { setUserDeposit, setCryptoBalance } from "../../slices/userSlice";
import { createDeposit, getHistory, getUserDeposit, getListUserCrypto, unDeposit } from "../../server";

import bigDepositImg from "./bigDeposit.svg";
import loadImg from "./load.svg";
import redArrow from "./red.svg"
import greenArrow from "./green.svg"

import "./Deposit.css"

export default function DepositPage() {
    const user = useSelector(state => state.user.cryptoBalance);
    const userDeposit = useSelector(state => state.user.deposit);

    const [period, setPeriod] = useState(null);
    const [userSelectCripto, setUserSelectCripto] = useState(null);
    const [userInputPrice, setUserInputPrice] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [limitedInput, setLimitedInput] = useState("min");

    const [historyLocal, setHistoryLocal] = useState("deposit");

    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            if (user !== 'load' && Object.values(user).length !== 0) {
                setUserSelectCripto(user?.['usdc'] || { nane: "usdc", total: 0 });
            }
        }
    }, [user]);

    useEffect(() => {
        if (Object.values(userDeposit).length !== 0) {
            setPeriod(userDeposit.period);
        }
    }, [userDeposit]);

    function onSelectPeriod(e) {
        const periods = [
            [100, 8],
            [200, 21],
            [300, 33],
            [500, 60],
            [1000, 150],
        ]

        if (Object.values(userDeposit).length === 0) {
            setPeriod(...periods.filter(item => item[0] == e.currentTarget.getAttribute("data-days")));
        }
    }

    const menuDeposit = <div className="menuDeposit">
        <p className="title">Deposit</p>
        <div className="periodsTabs">
            <div className={"period" + (period?.[0] === 100 ? " active" : "")} onClick={onSelectPeriod} data-days="100">100 days <span>from 8%</span></div>
            <div className={"period" + (period?.[0] === 200 ? " active" : "")} onClick={onSelectPeriod} data-days="200">200 days <span>from 21%</span></div>
            <div className={"period" + (period?.[0] === 300 ? " active" : "")} onClick={onSelectPeriod} data-days="300">300 days <span>from 33%</span></div>
            <div className={"period" + (period?.[0] === 500 ? " active" : "")} onClick={onSelectPeriod} data-days="500">500 days <span>from 60%</span></div>
            <div className={"period" + (period?.[0] === 1000 ? " active" : "")} onClick={onSelectPeriod} data-days="1000">1000 days <span>from 150%</span></div>
        </div>
    </div>

    if (!userSelectCripto || userDeposit === 'load' || !userDeposit) {
        return (
            <div className="deposit loadDepo">
                {menuDeposit}
                <div className='loadBlock'>
                    <img className='loadImg' src={loadImg} alt="" />
                    <p className='loadText'>Loading...</p>
                </div>
            </div>
        )
    } else {
        const buttonHandler = (type) => {
            if (userInputPrice || type === 'undeposit') {
                setIsLoading(true); // Починаємо завантаження

                (type === 'deposit' ? createDeposit(userSelectCripto.name, userInputPrice, period) : unDeposit(userSelectCripto.name))
                    .then(() => {
                        Promise.all([getUserDeposit(), getHistory(), getListUserCrypto()]).then((response) => {
                            dispatch(setUserDeposit(response[0].userDeposit));
                            dispatch(setHistory(response[1].userHistory));
                            dispatch(setCryptoBalance(response[2].balanceCrypto));

                            showNotification('Currency purchased successfully', true);
                            setLimitedInput("min");
                            setUserInputPrice(0);
                            setIsLoading(false);
                            setHistoryLocal("order")
                        }).catch(() => {
                            showNotification('Transaction failed', false);
                            setIsLoading(false);
                        });
                    })
                    .catch(() => {
                        showNotification('Transaction failed', false);
                        setIsLoading(false);
                    });
            } else {
                console.error('No currency data.');
            }
        };

        const showNotification = (message, isSuccess) => {
            setNotification({ message, isSuccess });
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        };

        function limitedValidator(value) {
            const max = parseFloat(userSelectCripto.total);
            const min = 10;

            if (parseFloat(value) > max) {
                setLimitedInput("max");
            } else if ((parseFloat(value) < min) || !parseFloat(value)) {
                setLimitedInput("min");
            } else {
                setLimitedInput("value");
            }
        }

        function onSelectCrypto(e) {
            const cryptoName = e.currentTarget.getAttribute("data-crypto");

            setUserSelectCripto(user?.[cryptoName] || { name: cryptoName, total: 0 });
            setLimitedInput("min");
            setUserInputPrice(0);
        }

        function onShowDetails(e) {
            if (e.target.textContent === "Details") {
                e.currentTarget.classList.add("show");
                e.target.textContent = "Close";
            } else {
                e.currentTarget.classList.remove("show");
                e.target.textContent = "Details";
            }
        }

        function onTabsHistory(e) {
            const tab = e.currentTarget.getAttribute("data-history");

            if (tab === 'deposit') {
                setHistoryLocal("deposit")
            } else {
                setHistoryLocal("order")
            }
        }

        return (
            <div className="deposit">
                {menuDeposit}
                {
                    !period
                        ?
                        <div className="main" style={{height: "70vh"}}>
                            <img src={bigDepositImg} alt="" />
                            <p>Select deposit period</p>
                        </div>
                        :
                        <div className="main">
                            <div className="selectCripto">
                                {
                                    Object.values(userDeposit).length === 0
                                        ?
                                        <>
                                            <div className="currencyCrypto">
                                                <p className={"crypto" + (userSelectCripto.name === "usdc" ? " active" : "")} onClick={onSelectCrypto} data-crypto={"usdc"}>USDC</p>
                                                <p className={"crypto" + (userSelectCripto.name === "usdd" ? " active" : "")} onClick={onSelectCrypto} data-crypto={"usdd"}>USDD</p>
                                            </div>
                                            <div className="balanceCrypto"><span>Your balance:</span> <span title={userSelectCripto.total}>{(userSelectCripto.total + "").substr(0, 7)} <span>{userSelectCripto.name}</span></span></div>
                                            <div className="labelForm">Amount</div>
                                            <div className="inputBox">
                                                <CryptoForm
                                                    inputHandler={setUserInputPrice}
                                                    inputValue={userInputPrice}
                                                    limitedValidator={limitedValidator}
                                                />
                                                <p>{userSelectCripto.name}</p>
                                            </div>
                                            <Message limitStatus={limitedInput} />
                                            <button
                                                className={"crypto-form__button widthBtn" + ((isLoading || (limitedInput !== "value")) ? " disablet" : "")}
                                                onClick={() => { buttonHandler("deposit") }}
                                                disabled={isLoading || (limitedInput !== "value")} // Вимикаємо кнопку під час завантаження
                                            >
                                                {isLoading ? 'Loading...' : 'Make a deposit'}
                                            </button>
                                            <div className="details" onClick={onShowDetails}>
                                                <p className="btn">Details</p>
                                                <p className="text"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pharetra lorem diam, at aliquam diam aliquam dapibus. Praesent posuere pellentesque erat, a efficitur orci tempus ut. Nulla imperdiet eget turpis in condimentum. Nam mollis ut magna ut faucibus. Maecenas non augue aliquam, volutpat elit et, viverra nunc. Integer rhoncus erat consectetur dui egestas elementum. Nam a convallis odio. Nullam viverra risus vel nunc accumsan dignissim. <br /> Etiam efficitur ligula vel lobortis lacinia. Curabitur dolor nibh, porttitor ac bibendum ut, finibus sed nisi. Mauris vel dui non felis facilisis cursus. Nulla a molestie lorem. Ut cursus id arcu id ornare. Nulla maximus arcu augue. In convallis eu justo ac volutpat. Quisque sit amet molestie nisl, ac dictum sapien. Sed mi odio, aliquet sit amet nisl quis, sodales vehicula lorem. Vivamus facilisis nulla rutrum, tempus diam in, sollicitudin felis.</span></p>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="currencyCrypto" style={{ flexDirection: 'column' }}>
                                                <p className="crypto active wid">{userDeposit.name.toUpperCase()}: {userDeposit.result}</p>
                                                <p className="crypto wid" style={{ fontSize: 22 }}>Earnings: {userDeposit.result - userDeposit.total}</p>
                                            </div>
                                            <button
                                                className={"crypto-form__button widthBtn" + (isLoading ? " disablet" : "")}
                                                onClick={() => { buttonHandler("undeposit") }}
                                                disabled={isLoading} // Вимикаємо кнопку під час завантаження
                                            >
                                                {isLoading ? 'Loading...' : 'Withdraw funds'}
                                            </button>
                                            <div className="details" onClick={onShowDetails}>
                                                <p className="btn">Details</p>
                                                <p className="text"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pharetra lorem diam, at aliquam diam aliquam dapibus. Praesent posuere pellentesque erat, a efficitur orci tempus ut. Nulla imperdiet eget turpis in condimentum. Nam mollis ut magna ut faucibus. Maecenas non augue aliquam, volutpat elit et, viverra nunc. Integer rhoncus erat consectetur dui egestas elementum. Nam a convallis odio. Nullam viverra risus vel nunc accumsan dignissim. <br /> Etiam efficitur ligula vel lobortis lacinia. Curabitur dolor nibh, porttitor ac bibendum ut, finibus sed nisi. Mauris vel dui non felis facilisis cursus. Nulla a molestie lorem. Ut cursus id arcu id ornare. Nulla maximus arcu augue. In convallis eu justo ac volutpat. Quisque sit amet molestie nisl, ac dictum sapien. Sed mi odio, aliquet sit amet nisl quis, sodales vehicula lorem. Vivamus facilisis nulla rutrum, tempus diam in, sollicitudin felis.</span></p>
                                            </div>

                                        </>
                                }
                            </div>
                            <div className="infoDeposit">
                                <div className="tabsHistory">
                                    {
                                        Object.values(userDeposit).length === 0
                                        ?
                                        <div className="limit">
                                            <div className="tabs">
                                                <p className="active">Deposit history</p>
                                            </div>
                                            <div className="historyDeposit" style={{display: historyLocal === 'deposit' ? "block" : "none"}}>


                                            </div>
                                        </div>
                                        :
                                        <div className="limit">
                                            <div className="tabs">
                                                <p className={historyLocal === 'deposit' ? "active" : ""} onClick={onTabsHistory} data-history="deposit">Deposit history</p>
                                                <p className={historyLocal === 'order' ? "active" : ""} onClick={onTabsHistory} data-history="order">Order history</p>
                                            </div>
                                            <div className="historyDeposit" style={{display: historyLocal === 'deposit' ? "block" : "none"}}>


                                            </div>
                                            <div className="wraper" style={{display: historyLocal === 'order' ? "block" : "none"}}>
                                                <HistoryOrder period={period} />
                                            </div>
                                        </div>
                                    }
                                    
                                </div>
                                <div className="chartDeposit">
                                    {
                                        Object.values(userDeposit).length === 0
                                        ?
                                        <div className="noChart">
                                            <img src={bigDepositImg} alt="" />
                                        </div>
                                        :
                                        <div>Profitability growth</div>
                                    }
                                </div>
                            </div>
                        </div>
                }
                {notification && (
                    <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                        {notification.message}
                    </div>
                )}
            </div>
        )
    }
}

function Message({ limitStatus }) {

    switch (limitStatus) {
        case "min":
            return (
                <div className="messageDeposit">
                    <p>Minimum amount 10</p>
                </div>
            )
        case "max":
            return (
                <div className="messageDeposit">
                    <p>Insufficient funds</p>
                </div>
            )
        default:
            break;
    }
}

function HistoryOrder({ period }) {
    let records = 1;

    console.log(period);

    switch (period[0]) {
        case 100:
            records = 1
            break;
        case 200:
            records = 2
            break;
        case 300:
            records = 3
            break;
        case 500:
            records = 5
            break;
        case 1000:
            records = 10
            break;
        default:
            break;
    }

    let elem = [];

    for (let i = 0; i < records; i++) {
        elem.push(<div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">10.10.2023</p>
            <p className="total">{0.000411 * period[1]}</p>
            <p className="crypto">BTH</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">12.10.2023</p>
            <p className="total">{0.04 * period[1]}</p>
            <p className="crypto">MKR</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">13.10.2023</p>
            <p className="total">{(32.072 * period[1]).toFixed(4)}</p>
            <p className="crypto">AAVE</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">13.10.2023</p>
            <p className="total">{0.000411 * period[1]}</p>
            <p className="crypto">BTH</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">15.10.2023</p>
            <p className="total">{51 * period[1]}</p>
            <p className="crypto">LTC</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{(112.099 * period[1]).toFixed(4)}</p>
            <p className="crypto">SOL</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{0.04 * period[1]}</p>
            <p className="crypto">MKR</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">20.10.2023</p>
            <p className="total">{(9.072 * period[1]).toFixed(4)}</p>
            <p className="crypto">AAVE</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">21.10.2023</p>
            <p className="total">{51 * period[1]}</p>
            <p className="crypto">LTC</p>
        </div><div className="record">
            <img src={redArrow} alt="" />
            <p className="date">21.10.2023</p>
            <p className="total">{(112.099 * period[1]).toFixed(4)}</p>
            <p className="crypto">SOL</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">13.10.2023</p>
            <p className="total">{(2.072 * period[1]).toFixed(4)}</p>
            <p className="crypto">AAVE</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">13.10.2023</p>
            <p className="total">{0.000411 * period[1]}</p>
            <p className="crypto">BTH</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">15.10.2023</p>
            <p className="total">{51 * period[1]}</p>
            <p className="crypto">LTC</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{(112.099 * period[1]).toFixed(4)}</p>
            <p className="crypto">SOL</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{0.04 * period[1]}</p>
            <p className="crypto">MKR</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">15.10.2023</p>
            <p className="total">{51 * period[1]}</p>
            <p className="crypto">LTC</p>
        </div>
        <div className="record">
            <img src={greenArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{(112.099 * period[1]).toFixed(4)}</p>
            <p className="crypto">SOL</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">19.10.2023</p>
            <p className="total">{0.04 * period[1]}</p>
            <p className="crypto">MKR</p>
        </div>
        <div className="record">
            <img src={redArrow} alt="" />
            <p className="date">20.10.2023</p>
            <p className="total">{(12.072 * period[1]).toFixed(4)}</p>
            <p className="crypto">AAVE</p>
        </div>
        </div>)
    }

    return (
        <div className="historyOrder">
            {elem}
        </div>
    )
}