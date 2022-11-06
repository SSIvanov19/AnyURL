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

const isURLValid = url.startsWith('http') || url.startsWith('chrome-extension');

if (url.startsWith('chrome-extension://')) {
    url = phishySites[phishySites.length - 1].domain;
} else {
    url = url.split('/')[2];
}

p.innerHTML = url;
statusText.innerHTML = 'Checking URL...';

console.log(phishySites);

const site = phishySites.findLast((site) => site.domain === url);
let res = 'secure';

if (site !== undefined) {
    res = site.severity;

    reasons.innerHTML = 'Reasons:';

    if (!site.enhancedSecurityCheck) {
        reasons.innerHTML += '<br>The site might try to steal your data.';
    }

    if (!site.sslCheck) {
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
    chrome.action.setIcon({ path: '../assets/icon-sus.png' });
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
const downloadButton = document.querySelector('#download-button');
const mainPage = document.querySelector('#main-page');
const whitelistPage = document.querySelector('#whitelist-page');
const blacklistPage = document.querySelector('#blacklist-page');
const whitelistBackButton = document.querySelector('#whitelist-back-button');
const whitelistContainer = document.querySelector('#whitelist-container');
const whitelistAddButton = document.querySelector('#whitelist-add-button');
const blacklistBackButton = document.querySelector('#blacklist-back-button');
const blacklistContainer = document.querySelector('#blacklist-container');
const blacklistAddButton = document.querySelector('#blacklist-add-button');

let blacklist = (await chrome.storage.sync.get('blacklist')).blacklist;
let whitelist = (await chrome.storage.sync.get('whitelist')).whitelist;

blacklist.forEach((element) => {
    blacklistContainer.innerHTML += `
    <div class="flex justify-around mt-5">
          <svg
            class="h-9 w-9"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.3333 19.1572C37.3333 16.7497 36.8591 14.3657 35.9378 12.1414C35.0164 9.91708 33.666 7.89603 31.9636 6.19362C30.2612 4.49122 28.2401 3.14079 26.0158 2.21946C23.7915 1.29812 21.4075 0.823914 19 0.823914C14.1377 0.823914 9.4745 2.75546 6.03633 6.19362C2.59817 9.63179 0.666626 14.2949 0.666626 19.1572C0.666626 24.0196 2.59817 28.6827 6.03633 32.1209C9.4745 35.559 14.1377 37.4906 19 37.4906C23.8623 37.4906 28.5254 35.559 31.9636 32.1209C35.4018 28.6827 37.3333 24.0196 37.3333 19.1572ZM33.5383 17.3239H28.1666C27.8643 13.0122 26.3869 8.86556 23.895 5.33391C26.4551 6.24319 28.7125 7.84571 30.4152 9.96279C32.1179 12.0799 33.1991 14.6283 33.5383 17.3239ZM13.6466 20.9906H24.5C24.0308 25.52 22.1002 29.7736 19 33.1089C15.9018 29.7876 14.0155 25.5176 13.6466 20.9906ZM13.6466 17.3239C14.0736 12.8173 15.9522 8.57106 19 5.22391C22.1253 8.53514 24.0602 12.792 24.5 17.3239H13.6466ZM14.3066 5.27891C11.8015 8.83012 10.3004 12.9912 9.96163 17.3239H4.46163C4.80795 14.595 5.91474 12.0185 7.6556 9.8886C9.39645 7.75872 11.7012 6.16135 14.3066 5.27891ZM4.46163 20.9906H9.96163C10.2636 25.3196 11.7544 29.4812 14.27 33.0172C11.6739 32.1305 9.3786 30.5334 7.64478 28.4075C5.91097 26.2815 4.80815 23.7119 4.46163 20.9906ZM23.8033 32.9989C26.312 29.4618 27.8195 25.3131 28.1666 20.9906H33.575C33.2283 23.7044 32.1294 26.2671 30.4026 28.3891C28.6759 30.5111 26.39 32.1079 23.8033 32.9989Z"
              fill="#6586C8"
            />
          </svg>
          <p class="text-2xl" style="line-height: 1.5rem">${element}</p>
          <svg
            class="h-7 w-7 cursor-pointer"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.092 3.73657L22.8285 20L39.092 36.2635L36.2636 39.0919L20.0001 22.8285L3.73666 39.0919L0.908234 36.2635L17.1717 20L0.908234 3.73657L3.73666 0.908145L20.0001 17.1716L36.2636 0.908145L39.092 3.73657Z"
              fill="#FF0000"
            />
          </svg>
        </div>`;
});

whitelist.forEach(element => {
    whitelistContainer.innerHTML += `
    <div class="flex justify-around mt-5">
          <svg
            class="h-9 w-9"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.3333 19.1572C37.3333 16.7497 36.8591 14.3657 35.9378 12.1414C35.0164 9.91708 33.666 7.89603 31.9636 6.19362C30.2612 4.49122 28.2401 3.14079 26.0158 2.21946C23.7915 1.29812 21.4075 0.823914 19 0.823914C14.1377 0.823914 9.4745 2.75546 6.03633 6.19362C2.59817 9.63179 0.666626 14.2949 0.666626 19.1572C0.666626 24.0196 2.59817 28.6827 6.03633 32.1209C9.4745 35.559 14.1377 37.4906 19 37.4906C23.8623 37.4906 28.5254 35.559 31.9636 32.1209C35.4018 28.6827 37.3333 24.0196 37.3333 19.1572ZM33.5383 17.3239H28.1666C27.8643 13.0122 26.3869 8.86556 23.895 5.33391C26.4551 6.24319 28.7125 7.84571 30.4152 9.96279C32.1179 12.0799 33.1991 14.6283 33.5383 17.3239ZM13.6466 20.9906H24.5C24.0308 25.52 22.1002 29.7736 19 33.1089C15.9018 29.7876 14.0155 25.5176 13.6466 20.9906ZM13.6466 17.3239C14.0736 12.8173 15.9522 8.57106 19 5.22391C22.1253 8.53514 24.0602 12.792 24.5 17.3239H13.6466ZM14.3066 5.27891C11.8015 8.83012 10.3004 12.9912 9.96163 17.3239H4.46163C4.80795 14.595 5.91474 12.0185 7.6556 9.8886C9.39645 7.75872 11.7012 6.16135 14.3066 5.27891ZM4.46163 20.9906H9.96163C10.2636 25.3196 11.7544 29.4812 14.27 33.0172C11.6739 32.1305 9.3786 30.5334 7.64478 28.4075C5.91097 26.2815 4.80815 23.7119 4.46163 20.9906ZM23.8033 32.9989C26.312 29.4618 27.8195 25.3131 28.1666 20.9906H33.575C33.2283 23.7044 32.1294 26.2671 30.4026 28.3891C28.6759 30.5111 26.39 32.1079 23.8033 32.9989Z"
              fill="#6586C8"
            />
          </svg>
          <p class="text-2xl" style="line-height: 1.5rem">${element}</p>
          <svg
            class="h-7 w-7 cursor-pointer"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.092 3.73657L22.8285 20L39.092 36.2635L36.2636 39.0919L20.0001 22.8285L3.73666 39.0919L0.908234 36.2635L17.1717 20L0.908234 3.73657L3.73666 0.908145L20.0001 17.1716L36.2636 0.908145L39.092 3.73657Z"
              fill="#FF0000"
            />
          </svg>
        </div>`;
});

blacklistAddButton.addEventListener("click", () => {
    const input = document.querySelector("#blacklist-input");
    const value = input.value;

    if (value !== '') {
        blacklist.push(value);
        chrome.storage.sync.set({ blacklist });
        blacklistContainer.innerHTML += `
        <div class="flex justify-around mt-5">
          <svg
            class="h-9 w-9"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.3333 19.1572C37.3333 16.7497 36.8591 14.3657 35.9378 12.1414C35.0164 9.91708 33.666 7.89603 31.9636 6.19362C30.2612 4.49122 28.2401 3.14079 26.0158 2.21946C23.7915 1.29812 21.4075 0.823914 19 0.823914C14.1377 0.823914 9.4745 2.75546 6.03633 6.19362C2.59817 9.63179 0.666626 14.2949 0.666626 19.1572C0.666626 24.0196 2.59817 28.6827 6.03633 32.1209C9.4745 35.559 14.1377 37.4906 19 37.4906C23.8623 37.4906 28.5254 35.559 31.9636 32.1209C35.4018 28.6827 37.3333 24.0196 37.3333 19.1572ZM33.5383 17.3239H28.1666C27.8643 13.0122 26.3869 8.86556 23.895 5.33391C26.4551 6.24319 28.7125 7.84571 30.4152 9.96279C32.1179 12.0799 33.1991 14.6283 33.5383 17.3239ZM13.6466 20.9906H24.5C24.0308 25.52 22.1002 29.7736 19 33.1089C15.9018 29.7876 14.0155 25.5176 13.6466 20.9906ZM13.6466 17.3239C14.0736 12.8173 15.9522 8.57106 19 5.22391C22.1253 8.53514 24.0602 12.792 24.5 17.3239H13.6466ZM14.3066 5.27891C11.8015 8.83012 10.3004 12.9912 9.96163 17.3239H4.46163C4.80795 14.595 5.91474 12.0185 7.6556 9.8886C9.39645 7.75872 11.7012 6.16135 14.3066 5.27891ZM4.46163 20.9906H9.96163C10.2636 25.3196 11.7544 29.4812 14.27 33.0172C11.6739 32.1305 9.3786 30.5334 7.64478 28.4075C5.91097 26.2815 4.80815 23.7119 4.46163 20.9906ZM23.8033 32.9989C26.312 29.4618 27.8195 25.3131 28.1666 20.9906H33.575C33.2283 23.7044 32.1294 26.2671 30.4026 28.3891C28.6759 30.5111 26.39 32.1079 23.8033 32.9989Z"
              fill="#6586C8"
            />
          </svg>
          <p class="text-2xl" style="line-height: 1.5rem">${value}</p>
          <svg
            class="h-7 w-7 cursor-pointer"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.092 3.73657L22.8285 20L39.092 36.2635L36.2636 39.0919L20.0001 22.8285L3.73666 39.0919L0.908234 36.2635L17.1717 20L0.908234 3.73657L3.73666 0.908145L20.0001 17.1716L36.2636 0.908145L39.092 3.73657Z"
              fill="#FF0000"
            />
          </svg>
        </div>`;
        input.value = '';
    }
});

whitelistAddButton.addEventListener('click', () => {
    const input = document.querySelector('#whitelist-input');
    const value = input.value;

    if (value !== '') {
        whitelist.push(value);
        chrome.storage.sync.set({ whitelist });
        whitelistContainer.innerHTML += `
        <div class="flex justify-around mt-5">
          <svg
            class="h-9 w-9"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.3333 19.1572C37.3333 16.7497 36.8591 14.3657 35.9378 12.1414C35.0164 9.91708 33.666 7.89603 31.9636 6.19362C30.2612 4.49122 28.2401 3.14079 26.0158 2.21946C23.7915 1.29812 21.4075 0.823914 19 0.823914C14.1377 0.823914 9.4745 2.75546 6.03633 6.19362C2.59817 9.63179 0.666626 14.2949 0.666626 19.1572C0.666626 24.0196 2.59817 28.6827 6.03633 32.1209C9.4745 35.559 14.1377 37.4906 19 37.4906C23.8623 37.4906 28.5254 35.559 31.9636 32.1209C35.4018 28.6827 37.3333 24.0196 37.3333 19.1572ZM33.5383 17.3239H28.1666C27.8643 13.0122 26.3869 8.86556 23.895 5.33391C26.4551 6.24319 28.7125 7.84571 30.4152 9.96279C32.1179 12.0799 33.1991 14.6283 33.5383 17.3239ZM13.6466 20.9906H24.5C24.0308 25.52 22.1002 29.7736 19 33.1089C15.9018 29.7876 14.0155 25.5176 13.6466 20.9906ZM13.6466 17.3239C14.0736 12.8173 15.9522 8.57106 19 5.22391C22.1253 8.53514 24.0602 12.792 24.5 17.3239H13.6466ZM14.3066 5.27891C11.8015 8.83012 10.3004 12.9912 9.96163 17.3239H4.46163C4.80795 14.595 5.91474 12.0185 7.6556 9.8886C9.39645 7.75872 11.7012 6.16135 14.3066 5.27891ZM4.46163 20.9906H9.96163C10.2636 25.3196 11.7544 29.4812 14.27 33.0172C11.6739 32.1305 9.3786 30.5334 7.64478 28.4075C5.91097 26.2815 4.80815 23.7119 4.46163 20.9906ZM23.8033 32.9989C26.312 29.4618 27.8195 25.3131 28.1666 20.9906H33.575C33.2283 23.7044 32.1294 26.2671 30.4026 28.3891C28.6759 30.5111 26.39 32.1079 23.8033 32.9989Z"
              fill="#6586C8"
            />
          </svg>
          <p class="text-2xl" style="line-height: 1.5rem">${value}</p>
          <svg
            class="h-7 w-7 cursor-pointer"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.092 3.73657L22.8285 20L39.092 36.2635L36.2636 39.0919L20.0001 22.8285L3.73666 39.0919L0.908234 36.2635L17.1717 20L0.908234 3.73657L3.73666 0.908145L20.0001 17.1716L36.2636 0.908145L39.092 3.73657Z"
              fill="#FF0000"
            />
          </svg>
        </div>`;
        input.value = '';
    }
});

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

downloadButton.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,URL,Domain Check,State,SSL Check,Virus Check\r\n";

    Object.values(phishySites).forEach(site => {
        console.log(Object.values(site).join(','));
        const row = Object.values(site).join(",");
        csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
});