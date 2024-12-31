document.addEventListener('DOMContentLoaded', () => {
  const gameNameElement = document.getElementById('gameName');
  const downloadBtn = document.getElementById('downloadBtn');

  chrome.runtime.sendMessage({ action: 'getGameInfo' }, (response) => {
    if (response && response.gameName) {
      gameNameElement.textContent = `${response.gameName}`;
    } else {
      gameNameElement.textContent = 'No game selected';
    }
  });

  downloadBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'downloadROM' });
  });
});