import { isUrlPhishy } from '../scripts/index.js';


chrome.storage.sync.get('isON', (data) => {
    if (data.isON === undefined) {
        chrome.storage.sync.set({ isON: true });
        chrome.storage.sync.set({ ssl: true });
        chrome.storage.sync.set({ advSec: true });
        chrome.storage.sync.set({ phishySites: [] });
        chrome.storage.sync.set({ whitelist: [] });
        chrome.storage.sync.set({ blacklist: [] });
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    console.log('Update tab', tab.url);

    if (!tab.url.startsWith('http')) {
        chrome.action.setIcon({ path: '../assets/logo.png' });
        console.log('Not a valid URL');
        return;
    }

    if (chrome.storage.sync.get('isON') && info.status === 'complete') {
        console.log('Checking URL');

        chrome.action.setIcon({ path: '../assets/logo.png' });

        const url = tab.url;
        const domain = url.split('/')[2];
        const res = await isUrlPhishy(
            domain,
            (await chrome.storage.sync.get('whitelist')).whitelist,
            (await chrome.storage.sync.get('blacklist')).blacklist,
            (await chrome.storage.sync.get('advSec')).advSec,
            (await chrome.storage.sync.get('ssl')).ssl,
            true
        );

        console.log('Result:', res);

        if (res === 'secure') {
            chrome.action.setIcon({ path: '../assets/icon-secure.png' });
        } else if (res === 'suspicious') {
            chrome.action.setIcon({ path: '../assets/icon-sus.png' });
        } else {
            chrome.action.setIcon({ path: '../assets/icon-phishy.png' });

            chrome.tabs.create({ url: '../alert/alert.html' });
        }
    }
});