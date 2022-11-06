import { isUrlPhishy } from '../scripts/index.js';


chrome.storage.sync.get('isON', (data) => {
    if (data.isON === undefined) {
        chrome.storage.sync.set({ isON: true });
        chrome.storage.sync.set({ ssl: true });
        chrome.storage.sync.set({ advSec: true });
        chrome.storage.sync.set({ phishySites: [] });
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    console.log('Update tab', tab.url);

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
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
            chrome.storage.sync.get('whitelist'),
            true,
            true,
            true
        );

        console.log('Result:', res);

        if (res === 'secure') {
            chrome.action.setIcon({ path: '../assets/icon-secure.png' });
        } else if (res === 'suspicious') {
            chrome.action.setIcon({ path: '../assets/icon-phishy.png' });

        } else {
            chrome.action.setIcon({ path: '../assets/icon-phishy.png' });

            let phishySites = await chrome.storage.sync.get('phishySites');

            phishySites = phishySites.phishySites;

            if (phishySites === undefined) {
                phishySites = [];
            }

            phishySites.push(domain);
            await chrome.storage.sync.set({ phishySites });

            chrome.tabs.create({ url: '../alert/alert.html' });
        }
    }
});