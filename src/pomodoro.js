class _PomodoroServiceClass {
    constructor() {
      this.WORK_INTERVAL = 25 * 60 * 1000;  // 25 минут работы
      this.BREAK_INTERVAL = 5 * 60 * 1000;  // 5 минут отдыха
      this.pomodoroTimer = null;
      this.isPomodoroActive = false;
      this.onBreak = false;
    }
  
    startPomodoro() {
      this.stopPomodoro();
      this.isPomodoroActive = true;
      this.pomodoroTimer = setTimeout(() => {
        console.log(this.isPomodoroActive, this.onBreak)
        if (this.isPomodoroActive && !this.onBreak) {
          this.onBreak = true;
          chrome.storage.local.set({ startBreak: true });  // Устанавливаем флаг для внешнего использования
  
          setTimeout(() => {
            if (this.isPomodoroActive && this.onBreak) {
              this.onBreak = false;
              chrome.storage.local.set({ endBreak: true }); 
              // this.notifyTabs("endBreak");
              this.startPomodoro();  // Перезапускаем рабочий интервал после перерыва
            }
          }, this.BREAK_INTERVAL);
        }
      }, this.WORK_INTERVAL);
    }
  
    stopPomodoro() {
      if (this.pomodoroTimer) {
        clearTimeout(this.pomodoroTimer);
        this.pomodoroTimer = null;
      }
      this.onBreak = false;
      this.isPomodoroActive = false;
      chrome.storage.local.remove(['pomodoroExpired']);
    }
  
    notifyTabs(action) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: action });
        }
      });
    }
}
  
export const PomodoroService = new _PomodoroServiceClass();