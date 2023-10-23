import React from 'react'

import { BiSolidBookReader, BiSolidVideos, BiMessageDetail } from "react-icons/bi";

import "./style.css";

const SupportPage = () => {
    return (
        <div className='support'>
            <h2>Algo Wallet Support</h2>
            <p>Update your wallet to the latest version:</p>
            <a href=""> algowallet.io/downloads</a>
            <div className="row support-item-container">
                <div className="support-item">
                    <div className="icon"><BiSolidBookReader /></div>
                    <div className="text">
                        Knowledge Base
                    </div>
                </div>
                <div className="item">
                    <div className="icon"><BiMessageDetail /></div>
                    <div className="text">
                        Contact Support
                    </div>
                </div>
                <div className="item">
                    <div className="icon"><BiSolidVideos /></div>
                    <div className="text">
                        Video
                        Tutorials
                    </div>
                </div>
            </div>
            <p>Check out our social media</p>
            <div className="row social">
                <div className="icon"></div>
                <div className="icon"></div>
                <div className="icon"></div>
                <div className="icon"></div>
            </div>
            <p>Anonymous Algo ID</p>
            <p>a3722dcbab7678...f1800159c853b3</p>
        </div>
    )
}

export default SupportPage;
