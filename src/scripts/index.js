import topUsedSites from './topUsedSites.js';
const whitelistedUrls = [];
const hasVirusTotalChecks = true;

const certificateIsSelfSigned = (issuer, subject) => {
    return issuer === subject;
};

const checkVirusTotal = async (url) => {
  if (hasVirusTotalChecks) {
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${btoa('https://skidrowgames.cc/plugins/loads/Skidrowgames.exe')}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': '77cce44682d4ac4c2010b207b4c305575c1962cd0b59fa02494d4e1b4210089f'
        }
    });

    let analysisScore = 0;

    response.json().then(res => {
        analysisScore = res.data.attributes.last_analysis_stats.suspicious + res.data.attributes.last_analysis_stats.malicious;
    });

    return analysisScore > 0;
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

const isUrlPhishy = (
    url,
    sslIssuer = '',
    sslSubject = '',
    whitelist = [],
    hasVirusTotalChecks = false,
    hasSSLCheck = false,
    hasEnhancedSecurity = false,
) => {
    if (url in whitelist) {
        return 'secure';
    }

    const checks = {
        virusTotal: hasVirusTotalChecks ? checkVirusTotal(url) : true,
        enhancedSecurity: hasEnhancedSecurity ? isUrlCloseToFamousUrl(url): true,
        SSL: hasSSLCheck ? certificateIsSelfSigned(sslIssuer, sslSubject) : true
    };

    let checksPassed = 0;

    Object.keys(checks).forEach(check => {
        if (check) {
            checksPassed += 1;
        }
    });

    if (checksPassed === 3) {
        return 'secure';
    } else if (checksPassed in [2, 1]) {
        return 'suspicious';
    } else {
        return 'dangerous';
    }
};
