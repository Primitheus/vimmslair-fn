let url = "";
let gameName = "No Game Selected";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setGameUrl') {
    url = request.gameUrl;
    gameName = request.gameName ? request.gameName.replace(/[<>:"\/\\|?*]+/g, '') : "No Game Selected"; // Remove invalid filename characters
    console.log('Game URL set to:', url);
    console.log('Game name set to:', gameName);
  }

  if (request.action === 'getGameInfo') {
    sendResponse({ gameName });
  }




  
  if (request.action === 'downloadROM') {
    if (!url) {
      console.error('Game URL is not set.');
      return;
    }

    

    console.log('Received downloadROM action');
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'download2.vimm.net',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Opera GX";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      },
      credentials: 'omit'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid response:', response.status);
      }
      return response.blob();
    })
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const downloadUrl = reader.result;
        console.log('Download URL created:', downloadUrl);
        chrome.downloads.download({
          url: downloadUrl,
          filename: `${gameName}.z64`
        }, (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Error downloading file:', chrome.runtime.lastError);
          } else {
            console.log('Download started with ID:', downloadId);
          }
        });
      };
      reader.readAsDataURL(blob);
    })
    .catch(error => {
      console.error('Error making the request:', error);
    });
  }
});
