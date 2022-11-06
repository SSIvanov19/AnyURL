let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
let url = tabs[0].url;
const p = document.querySelector('#url');
const toggle = document.querySelector('#default-toggle');
const sslToggle = document.querySelector('#ssl-toggle');
const advSecToggle = document.querySelector('#adv-sec-toggle');
const blockNumber = document.querySelector('#block-number');
const statusText = document.querySelector('#status-text');
const secureSvg = document.querySelector('#secure-svg');
const susSvg = document.querySelector('#sus-svg');
const dangerousSvg = document.querySelector('#dangerous-svg');
const reasons = document.querySelector('#reasons');

let phishySites = await chrome.storage.sync.get('phishySites');
phishySites = phishySites.phishySites;

const isURLValid  =  url.startsWith('http');

if (url.startsWith('chrome-extension://')) {
    url = phishySites[phishySites.length - 1];
} else {
    url = url.split('/')[2];
}

p.innerHTML = url;
statusText.innerHTML = 'Checking URL...';

console.log(phishySites);

const site = phishySites.find((site) => site.domain === url);
let res = 'secure';

if (site !== undefined) {
    res = site.severity;

    console.log(site);
    reasons.innerHTML = 'Reasons:';

    if (!site.enhancedSecurityCheck) {
        reasons.innerHTML += '<br>The site might try to steal your data.';
    }

    if (!site.SSL) {
        reasons.innerHTML += '<br>The site SSL certificate is not valid.'; 
    }

    if (!site.virusTotalCheck) {
        reasons.innerHTML += '<br>The site might include malicious files.';
    }
}

if (res === 'secure') {
    statusText.innerHTML = 'SECURE';
    statusText.style.color = '#67C865';
    secureSvg.style.display = 'block';
    susSvg.style.display = 'none';
    dangerousSvg.style.display = 'none';
    reasons.style.display = 'none';
    chrome.action.setIcon({ path: '../assets/icon-secure.png' });
} else if (res === 'suspicious') {
    statusText.innerHTML = 'SUSPICIOUS';
    statusText.style.color = '#FFB800';
    secureSvg.style.display = 'none';
    susSvg.style.display = 'block';
    dangerousSvg.style.display = 'none';
    chrome.action.setIcon({ path: '../assets/icon-phishy.png' });
} else {
    statusText.innerHTML = 'DANGEROUS';
    statusText.style.color = 'red';
    secureSvg.style.display = 'none';
    susSvg.style.display = 'none';
    dangerousSvg.style.display = 'block';
    chrome.action.setIcon({ path: '../assets/icon-phishy.png' });
}

if (!isURLValid) {
    p.innerText = 'Not a valid URL';
    statusText.innerHTML = 'Not a valid URL';
    secureSvg.style.display = 'none';
    susSvg.style.display = 'none';
    dangerousSvg.style.display = 'none';
    statusText.style.color = '#474747';
    chrome.action.setIcon({ path: '../assets/logo.png' });
}

chrome.storage.sync.get('phishySites', (data) => {
    blockNumber.innerHTML = data.phishySites.length;
});

chrome.storage.sync.get('isON', (data) => {
    if (!data.isON) {
        sslToggle.removeAttribute('checked');
        toggle.removeAttribute('checked');
        advSecToggle.removeAttribute('checked');
        chrome.storage.sync.set({ ssl: false });
        chrome.storage.sync.set({ advSec: false });
    }
});

toggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ isON: e.target.checked });

    if (!e.target.checked) {
        sslToggle.removeAttribute('checked');
        toggle.removeAttribute('checked');
        advSecToggle.removeAttribute('checked');
        chrome.storage.sync.set({ ssl: false });
        chrome.storage.sync.set({ advSec: false });
    } else {
        sslToggle.setAttribute('checked', '');
        toggle.setAttribute('checked', '');
        advSecToggle.setAttribute('checked', '');
        chrome.storage.sync.set({ ssl: true });
        chrome.storage.sync.set({ advSec: true });
    }
});

chrome.storage.sync.get('ssl', (data) => {
    if (!data.ssl) {
        sslToggle.removeAttribute('checked');
    }
});

sslToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ ssl: e.target.checked });
});

chrome.storage.sync.get('advSec', (data) => {
    if (!data.advSec) {
        advSecToggle.removeAttribute('checked');
    }
});

advSecToggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ advSec: e.target.checked });
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