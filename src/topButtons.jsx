import React, { useMemo } from 'react';

export const TopButtons = ({ onBack, onOpenSettings, settingsMenuOpened }) => {
    const color = useMemo(()=> settingsMenuOpened ? "#E5E7EA" : "#2C2C2C",[settingsMenuOpened])
    return <div className='top-buttons'>
        <div className='back-button' onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="2"/>
                <path d="M7.50502 11.505C7.23166 11.7784 7.23166 12.2216 7.50502 12.495L11.9598 16.9497C12.2332 17.2231 12.6764 17.2231 12.9497 16.9497C13.2231 16.6764 13.2231 16.2332 12.9497 15.9598L8.98995 12L12.9497 8.0402C13.2231 7.76684 13.2231 7.32362 12.9497 7.05025C12.6764 6.77689 12.2332 6.77689 11.9598 7.05025L7.50502 11.505ZM16 11.3L8 11.3V12.7L16 12.7V11.3Z" fill={color}/>
            </svg>
        </div>
        <div className='open-settings-button' onClick={onOpenSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="25" viewBox="0 0 7 25" fill="none">
            <circle cx="3.54522" cy="3.10588" r="3.03814" fill={color}/>
            <circle cx="3.54522" cy="12.2203" r="3.03814" fill={color}/>
            <circle cx="3.54522" cy="21.3346" r="3.03814" fill={color}/>
        </svg>
        </div>
    </div>
}