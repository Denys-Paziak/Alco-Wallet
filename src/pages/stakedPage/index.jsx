import {  Link, useLocation  } from "react-router-dom";

import arrowBack from "./arrow_back.svg";

export default function StakedPage() {

    const pathname = useLocation().pathname.split('/');

    return (
        <div className="stakedPage">
            <Link to={"/staking/" + pathname[2]} className='back'>
                <img src={arrowBack} alt="" />
            </Link>
        </div>
    )
}