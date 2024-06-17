import React, { useState, useEffect } from 'react';

export const ListManager = ({ listType }) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        chrome.storage.local.get([listType], (result) => {
            setList(result[listType] || []);
        });
    }, [listType]);

    const addItem = (item) => {
        if (!list.includes(item)) {
            const newList = [...list, item];
            setList(newList);
            chrome.storage.local.set({ [listType]: newList });
        }
    };

    const removeItem = (item) => {
        const newList = list.filter(i => i !== item);
        setList(newList);
        chrome.storage.local.set({ [listType]: newList });
    };

    const addCurrentSite = () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0 && tabs[0].url) {
                const url = new URL(tabs[0].url);
                addItem(url.hostname);
            }
        });
    };

    return (
        <div className="list-manager">
            <h2>{listType === 'blacklist' ? 'Черный список' : 'Белый список'}</h2>
            <button className="action-button" onClick={addCurrentSite}>Добавить текущий сайт</button>
            <div className="list-container">
               {list.length ? list.map(item => (
                    <div key={item} className="list-item">
                        {item}
                        <button className="remove-button" onClick={() => removeItem(item)}>X</button>
                    </div>
                )) : <div className="list-item">Список пуст</div>}
            </div>
        </div>
    );
};
