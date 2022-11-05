chrome.tabs.onUpdated.addListener(async (tabId, info, tab)  =>{
    console.log(tab.url.split('/')[2]);
    chrome.notifications.create('NOTFICATION_ID', {
        type: 'basic',
        iconUrl: '../assets/logo.png',
        title: 'notification title',
        message: 'notification message',
        priority: 2
    })
 });