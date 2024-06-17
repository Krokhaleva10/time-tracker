chrome.storage.local.get(['blacklist'], function(result) {

    const blacklist = result.blacklist || [];
    const currentSite = window.location.hostname;
    if (blacklist.some(site => currentSite.includes(site))) {
      displayBanner();
    }
  });
  
  function displayBanner() {
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.background = "#3e383824";
    banner.style.top = '50%';
    banner.style.height = '80vh';
    banner.style.width = '80vw';
    banner.style.left = '50%';
    banner.style.transform = "translate(-50%, -50%)";
    banner.style.color = 'black';
    banner.style.padding = '50px';
    banner.style.backdropFilter = "blur(12px)";
    banner.style.zIndex = '10000';
    banner.style.fontSize = '24px';
    banner.style.fontWeight = 'bold';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.textShadow = "0.3px 0.01px #ece8e8d9";
    banner.style.justifyContent = 'center';
    
    banner.textContent = 'Этот сайт находится в черном списке.';
    document.body.appendChild(banner);
  }

  chrome.storage.local.onChanged.addListener((changes) => {
    Object.keys(changes).forEach((key) => {
      switch(key){
        case  'offerAddToBlacklist': {
          if (changes[key].newValue === window.location.hostname){
            const confirmAdd = confirm(`Вы провели на сайте ${window.location.hostname} более 3 минут. Хотите добавить его в черный список, чтобы помочь сосредоточиться?`);
            if (confirmAdd) {
              displayBanner();
              chrome.runtime.sendMessage({ action: "addToList", isBlack: true, hostname: window.location.hostname });
            } else {
              chrome.runtime.sendMessage({ action: "addToList", isBlack: false, hostname: window.location.hostname });
            }
            chrome.storage.local.set({'offerAddToBlacklist': ''})
          }
          return
        }
        case 'startBreak': {
          alert("Время для перерыва! Отдохните 5 минут.");
          return;
        }
        case 'endBreak':{
          alert("Перерыв закончился. Пора вернуться к работе!");
          return;
        }
      }
    });
  });
