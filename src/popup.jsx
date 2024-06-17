import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {ListManager} from './list-manager.jsx';
import "./popup.css"
import { TopButtons } from './topButtons.jsx';
import { Settings } from './settings.jsx';

const Popup = () => {
    const [settingsMenu, setSettingsMenu] = useState(false)
    // const [activityLogData, setActivityLogData] = useState({})

     
    const [isPomodoroActive, setIsPomodoroActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showList, setShowList] = useState(null); // null, 'blacklist', 'whiteList'

    useEffect(()=>{
        chrome.storage.local.get({ isPaused, isPomodoroActive }, (result) => {
            if (result.isPaused){
                setIsPaused(true)
            }
            if (result.isPomodoroActive){
                setIsPomodoroActive(true)
            }
          });
    },[])
    const togglePomodoro = () => {
        setIsPomodoroActive(prev => {
            const newState = !prev;
            chrome.runtime.sendMessage({ action: 'togglePomodoro', isActive: newState });
            return newState;
        });
    };

    const togglePause = () => {
        setIsPaused(prev => {
            const newState = !prev;
            chrome.runtime.sendMessage({ action: 'togglePause', isPaused: newState });
            return newState;
        });
    };

    return (
        <div className="popup-container">
            <TopButtons 
                settingsMenuOpened={settingsMenu}
                onBack={()=> {
                    setShowList(null)
                }} 
                onOpenSettings={()=> {
                    setSettingsMenu(prev => !prev)
                }}
            />
            { settingsMenu && <Settings />}
            {/* {Object.keys(activityLogData).map(key=> {
                return <div key={key}>
                    {key}: <p>{activityLogData[key].totalTime}</p>
                    <p>{activityLogData[key].lastContinuousTime}</p>
                    <p>{activityLogData[key].maxTime}</p>
                </div>
            })} */}
        {!showList ?         
          <>
           <h1>Time Tracker</h1>
            <div className="toggle-buttons">
                Pomodoro
            <label className="switch">
                <input type="checkbox" checked={!!isPomodoroActive} onChange={togglePomodoro}></input>
                <span className="slider round"></span>
            </label>
            
            Is Paused
            <label className="switch">
                <input type="checkbox" checked={isPaused} onChange={togglePause}></input>
                <span className="slider round"></span>
            </label>
            </div>
            <button className="action-button config-button" onClick={() => setShowList('blacklist')}>Настроить black list</button>
            <button className="action-button config-button" onClick={() => setShowList('whiteList')}>Настроить white list</button>
          </>
        : (
          <ListManager listType={showList} onClose={()=> setShowList(null)} />
        )}
        </div>
    );
};

const container = document.getElementById('popupApp');
const root = createRoot(container); // Создаем корневой элемент React
root.render(<Popup />);

