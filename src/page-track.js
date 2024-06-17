const V = 3
const getTime = () => {
    return V * 60 * 1000;
}
export class _ActivityTracker {
    isWindowFocused = true;
    activityStartTime = Date.now();
    intervalId = null;
    continuousActivityTime = 0;
    BLACK_LIST_TIME = getTime();

    constructor() {}

    startInterval(tabId) {
        chrome.storage.local.get({ blacklist: [], whiteList: [], isPomidorActive: false }, ({ blacklist, whiteList }) => {
            chrome.tabs.get(tabId, (tab) => {
                if (!tabId || !tab.url || chrome.runtime.lastError) {
                    // Если вкладка уже не активна - останавливаем таймер
                    this.stopInterval();
                    return;
                }
                const hostname = new URL(tab.url).hostname;
                // Если вкладка не чернои или белом листе - стартуем новый таймер
                if (!blacklist.includes(hostname) && !whiteList.includes(hostname)) {
                    if (this.intervalId !== null) {
                        // Удаляем предыдущий таймер
                        clearInterval(this.intervalId);
                    }
                    this.activityStartTime = Date.now();

                    this.intervalId = setInterval(() => {
                        if (this.isWindowFocused) {
                            // Запуск таймера
                            this.updateActivityLog(hostname);
                        }
                    }, 1500);
                }
            });
        });
    }

    updateActivityLog(hostname) {
        if (!hostname || chrome.runtime.lastError) {
            console.error('Error getting tab:', chrome.runtime.lastError?.message);
            this.stopInterval();
            return;
        }

        const currentTime = Date.now();
        
        const elapsedTime = currentTime - this.activityStartTime;
        this.continuousActivityTime += elapsedTime;

        chrome.storage.local.get({ activityLog: {} }, (data) => {
            let { activityLog } = data;

            if (!activityLog[hostname]) {
                activityLog[hostname] = { totalTime: 0, lastContinuousTime: 0, maxTime: 0 };
            }
            // Общее время проведенное на сайте 
            activityLog[hostname].totalTime += elapsedTime;
            // Последнее непрерывное время, проведенное на сайту
            activityLog[hostname].lastContinuousTime = this.continuousActivityTime;

            if (this.continuousActivityTime > activityLog[hostname].maxTime) {
                // Максимальное время, проведенное на сайте
                activityLog[hostname].maxTime = this.continuousActivityTime;
            }

            const storageParams = { activityLog };
            
            if (this.continuousActivityTime >= this.BLACK_LIST_TIME) {
                // Запрос на всплывающее окно добавления в черный список
                storageParams["offerAddToBlacklist"] = hostname;
            }

            chrome.storage.local.set(storageParams);

            this.activityStartTime = currentTime;
        });
    }

    stopInterval() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.continuousActivityTime = 0; // Reset ongoing activity time
        }
    }

    clearPageTrack() {
        this.activityStartTime = Date.now();
        this.continuousActivityTime = 0;
    }
}

export const ActivityTracker = new _ActivityTracker();