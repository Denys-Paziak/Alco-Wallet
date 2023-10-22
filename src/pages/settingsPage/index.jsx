import React, { useState } from 'react';


const tabsData = ["Membership", "Security", "Private Keys"];

export default function SettingsPage() {
    const [activeTab, setTab] = useState(0);

    let renderedComponent;
    if (activeTab == 0) {
        renderedComponent = "Membership"
    } else if (activeTab == 1) {
        renderedComponent = "Security"
    } else {
        renderedComponent = "Private Keys"
    }

    return <div>
        <div className="page-tabs">
            {tabsData.map((el, index) => {
                if (index === activeTab) {
                    return <div key={el} className='active'
                        onClick={() => { setTab(index); }}>{el}</div>
                } else {
                    return <div key={el} onClick={() => { setTab(index); }}>{el}</div>
                }
            })}
        </div>
        {renderedComponent}
    </div>
};