const scripts = document.querySelectorAll('script');
let gameUrl = '';
scripts.forEach(script => {
  const scriptContent = script.textContent;
  const match = scriptContent.match(/EJS_gameUrl\s*=\s*'([^']+)'/);
  if (match) {
    gameUrl = match[1];
    console.log('Game URL found:', gameUrl);
  }
});

const gameNameElement = document.querySelector('h2[style*="text-align:center"][style*="font-weight:bold"][style*="text-decoration:underline"]');
let gameName = 'No Game Found!';
if (gameNameElement) {
  gameName = gameNameElement.textContent.trim();
  console.log('Game name found:', gameName);
}

if (gameUrl) {
  chrome.runtime.sendMessage({ action: 'setGameUrl', gameUrl, gameName });
}