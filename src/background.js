import { ActivityTracker } from "./page-track.js"
import { PomodoroService } from "./pomodoro.js"

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ activityLog: {}, blacklist: [], whiteList: [], isPomodoroActive: false, isPaused: false }); // Сброс данных при установке/обновлении расширения
});

let lastTabId = null; // ID последней активной вкладки

function onMessageListener(message) {
  if (message.action === "addToList" && message.hostname) {
    // Добавление сайта в белый или черный лист
    chrome.storage.local.get({ blacklist: [], whiteList: [] }, (result) => {
      const listKey = message.isBlack ? "blacklist" : "whiteList";
      const list = result[listKey];
      if (!list.includes(message.hostname)) {
        list.push(message.hostname);
        chrome.storage.local.set({ [listKey]: list }, () => {
          ActivityTracker.stopInterval();
          console.log(`${message.hostname} добавлен в список.`);
        });
      }
    });
  } else if (message.action === "togglePause") {
      chrome.storage.local.set({isPaused: message.isPaused})
    if (message.isPaused) {
      // Останавливаем интервал, если активирована пауза
      ActivityTracker.stopInterval(); 
    } else {
      if (lastTabId !== null) {
        // Возобновляем интервал, если пауза отключена
        ActivityTracker.startInterval(lastTabId); 
      }
    }
  } else if (message.action === "clearData") {
    // Очистка данных
    chrome.storage.local.remove(['activityLog', 'blacklist', 'whiteList', "isPomodoroActive", "isPaused"], function() {
      ActivityTracker.clearPageTrack()
    });
  } else if (message.action === "togglePomodoro") {
    // Активацияя техники помидоро
    PomodoroService.isPomodoroActive = message.isActive;
    chrome.storage.local.set({isPomodoroActive: message.isActive})
    if (PomodoroService.isPomodoroActive) {
      PomodoroService.startPomodoro();
    } else {
      PomodoroService.stopPomodoro();
    }
  } else if (message.action === "breakEnded") {
    PomodoroService.startPomodoro(); // Пользователь закончил перерыв, начинаем новый рабочий интервал
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  onMessageListener(message);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // Останавливаем предыдущий интервал перед запуском нового при открытии вкладки
  ActivityTracker.stopInterval();
  lastTabId = activeInfo.tabId;
  // Запускаем новый таймер
  ActivityTracker.startInterval(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === lastTabId) {
    // Останавливаем таймер если вкладка закрыта
    ActivityTracker.stopInterval();
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  ActivityTracker.isWindowFocused = windowId !== chrome.windows.WINDOW_ID_NONE;
  if (!ActivityTracker.isWindowFocused) {
    // Останавливаем таймер если вкладка не в фокусе
    ActivityTracker.stopInterval();
  } else if (lastTabId !== null) {
    // Запускаем таймер если вкладка в фокусе
    ActivityTracker.startInterval(lastTabId);
  }
});