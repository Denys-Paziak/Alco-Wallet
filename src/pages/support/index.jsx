import React from 'react'

import { BiSolidBookReader, BiSolidVideos, BiMessageDetail } from "react-icons/bi";

import book from "./book.svg";
import mess from "./mess.svg";
import video from "./video.svg";
import social from "./social.png";
import copy from "./copy.svg"

import "./style.css";

const SupportPage = () => {
    return (
        <div className='support'>
            <h2>Algo Wallet Support</h2>
            <div className='subTitle'>
                <p style={{color: '#FFFFFF80'}}>Update your wallet to the latest version:</p>
                <p style={{color: '#EB00FF'}}> algowallet.io/downloads</p>
            </div>
            <div className="row support-item-container">
                <div className="support-item">
                    <img src={book} className="icon"/>
                    <div className="text">
                        Knowledge <br /> Base
                    </div>
                </div>
                <div className="support-item">
                    <img src={mess} className="icon"/>
                    <div className="text">
                        Contact <br /> Support
                    </div>
                </div>
                <div className="support-item">
                    <img src={video} className="icon"/>
                    <div className="text">
                        Video <br />
                        Tutorials
                    </div>
                </div>
            </div>
            <p className='titleSocial'>Check out our social media</p>
            <div className="row social">
                <img src={social} alt="" />
            </div>
            <div className='AlgoID'>
                <p style={{color: '#FFFFFF80'}}>Anonymous Algo ID</p>
                <p className='ID' style={{color: '#EB00FF'}}> <span>a3722dcbab7678...f1800159c853b3</span> <img style={{marginLeft: 10}} src={copy} alt="" /></p>
            </div>
        </div>
    )
}

export default SupportPage;
