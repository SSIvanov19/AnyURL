let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
let url = tabs[0].url;
let p = document.querySelector('#url');

p.innerHTML = url.split('/')[2];

const toggle = document.querySelector('#default-toggle');
const sslToggle = document.querySelector('#ssl-toggle');
const advSecToggle = document.querySelector('#adv-sec-toggle');

chrome.storage.sync.get('isON', (data) => {
    if (!data.isON) {
        sslToggle.removeAttribute('checked');
        toggle.removeAttribute('checked');
        advSecToggle.removeAttribute('checked');
        chrome.storage.sync.set({ssl: false});
        chrome.storage.sync.set({advSec: false});
    }
});

toggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({isON: e.target.checked});

    if (!e.target.checked) {
        sslToggle.removeAttribute('checked');
        toggle.removeAttribute('checked');
        advSecToggle.removeAttribute('checked');
        chrome.storage.sync.set({ssl: false});
        chrome.storage.sync.set({advSec: false});
    } else {
        sslToggle.setAttribute('checked', '');
        toggle.setAttribute('checked', '');
        advSecToggle.setAttribute('checked', '');
        chrome.storage.sync.set({ssl: true});
        chrome.storage.sync.set({advSec: true});
    }
});

chrome.storage.sync.get('ssl', (data) => {
    if (!data.ssl) {
        sslToggle.removeAttribute('checked');
    }
});

sslToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ssl: e.target.checked});
});


chrome.storage.sync.get('advSec', (data) => {
    if (!data.advSec) {
        advSecToggle.removeAttribute('checked');
    }
});

advSecToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({advSec: e.target.checked});
});

const whitelistButton = document.querySelector('#whitelist-button');
const blacklistButton = document.querySelector('#blacklist-button');
const backButton = document.querySelector('#back-button');
const mainPage = document.querySelector('#main-page');
const whitelistPage = document.querySelector('#whitelist-page');
const blacklistPage = document.querySelector('#blacklist-page');
const whitelistBackButton = document.querySelector('#whitelist-back-button');


whitelistBackButton.addEventListener('click', () => {
    whitelistPage.style.display = 'none';
    mainPage.style.display = 'block';
});

whitelistButton.addEventListener('click', () => {
    mainPage.style.display = 'none';
    whitelistPage.style.display = 'block';
});

blacklistButton.addEventListener('click', () => {
    mainPage.style.display = 'none';
    blacklistPage.style.display = 'block';
});

backButton.addEventListener('click', () => {
    whitelistPage.style.display = 'none';
    blacklistPage.style.display = 'none';
    mainPage.style.display = 'block';
});