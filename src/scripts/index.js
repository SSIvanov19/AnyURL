import topUsedSites from './topUsedSites.js';
const checkSSLCert = async (url) => {
    const response = await fetch(`http://localhost:3000/ssl?url=${url}`, {
        method: 'GET'
    });

    const data = await response.json();

    try {
        const grade = data.endpoints[0].grade;

        return ['A+', 'A-', 'A', 'B+', 'B', 'B-'].includes(grade);
    } catch (e) {
        return true;
    }
};

const checkVirusTotal = async (url) => {
    const response = await fetch(`http://localhost:3000/virustotal?url=${url}`, {
        method: 'Get'
    });

    const data = await response.json();

    try {
        const analysisScore = data.total;
        return analysisScore > 80;
    } catch (e) {
        return true;
    }
};

const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
        }
    }
    return arr[t.length][s.length];
};


const isUrlCloseToFamousUrl = (url) => {
    for (const site of topUsedSites) {
        if (levenshteinDistance(url, site) <= 2) {
            return false;
        }
    }
    return true;
};

export const isUrlPhishy = async (
    url,
    whitelist = [],
    hasVirusTotalChecks = false,
    hasSSLCheck = false,
    hasEnhancedSecurity = false,
) => {
    if (url in whitelist) {
        return 'secure';
    }

    const checks = {
        virusTotal: hasVirusTotalChecks ? await checkVirusTotal(url) : true,
        enhancedSecurity: hasEnhancedSecurity ? isUrlCloseToFamousUrl(url) : true,
        SSL: hasSSLCheck ? await checkSSLCert(url) : true
    };

    console.log(checks)

    let checksPassed = 0;

    Object.keys(checks).forEach(check => {
        if (checks[check]) {
            checksPassed += 1;
        }
    });

    if (checksPassed === 3) {
        return 'secure';
    } else if ([2, 1].includes(checksPassed)) {
        return 'suspicious';
    } else {
        return 'dangerous';
    }
};
