import React from 'react'
import * as XLSX from 'xlsx'; // Импорт библиотеки, если используете модули

function exportToExcel(data) {
    const wb = XLSX.utils.book_new(); // Создаем новую книгу
    const wsData = [];

    // Добавляем заголовки для колонок
    wsData.push(['Host Name', 'Total Time', 'Last Continuous Time', 'Max Time']);

    // Преобразуем данные в нужный формат для Excel
    for (const [hostname, { totalTime, lastContinuousTime, maxTime }] of Object.entries(data)) {
        wsData.push([hostname, totalTime, lastContinuousTime, maxTime]);
    }

    // Создаем рабочий лист из данных
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Sites Data"); // Добавляем рабочий лист в книгу с именем "Sites Data"

    // Генерируем XLSX файл и инициируем загрузку
    XLSX.writeFile(wb, 'SiteData.xlsx');
}

// Пример использования
// const sitesData = {
//     'example.com': { totalTime: 300, lastContinuousTime: 100, maxTime: 150 },
//     'google.com': { totalTime: 500, lastContinuousTime: 200, maxTime: 300 }
// };

// exportToExcel(sitesData);

export const Settings = () => {
    return <div className='settings'>
            <button className="action-button settings-button" onClick={() => {
                  chrome.storage.local.get(['activityLog'], function(result) {
                    const activityLog = result.activityLog || {};
                    exportToExcel(activityLog)
                  })                
            }}>Экспортир XLSX</button>
            <button className="action-button settings-button" onClick={() => {
                chrome.runtime.sendMessage({ action: "clearData", clearData: true });
            }}>Сбросить данные</button>

    </div>
}