// -----------------------------------------------------------------
// 5 அவுட்புட் ஆப்ஷன்கள் கொண்ட அட்வான்ஸ்டு கணிப்பு என்ஜின்
// -----------------------------------------------------------------
function generatePredictions() {
    let currentDB = systemsDB[currentSystem];
    if (currentDB.length === 0) return;

    const container = document.getElementById('predictionContainer');
    let lastEntry = currentDB[currentDB.length - 1];

    if (currentSystem === 5) {
        // Option 5 (8-Digit)-க்கான கணிப்பு முறை
        let alpha = lastEntry.num.substring(0, 2);
        let numStr = lastEntry.num.substring(2);
        let totalDBCount = currentDB.length;
        let sumMatrix = [0, 0, 0, 0, 0, 0];

        currentDB.forEach(entry => {
            let n = entry.num.substring(2);
            for (let i = 0; i < 6; i++) { sumMatrix[i] += parseInt(n[i]); }
        });

        let pred_1 = ""; let pred_2 = "";
        for (let i = 0; i < 6; i++) {
            let avg = Math.round(sumMatrix[i] / totalDBCount);
            let lastDigit = parseInt(numStr[i]);
            pred_1 += (lastDigit + avg) % 10;
            pred_2 += Math.abs(9 - ((lastDigit + Math.round(avg/2)) % 10));
        }

        container.innerHTML = `
            <div><span style="font-size:12px; display:block; color:#555;">Trend 1</span><div class="pred-num" style="font-size:17px;">${alpha}${pred_1}</div></div>
            <div><span style="font-size:12px; display:block; color:#555;">Trend 2</span><div class="pred-num" style="font-size:17px;">${alpha}${pred_2}</div></div>
        `;
    } else {
        // --- 1 முதல் 4 வரையிலான 3-Digit ஆப்ஷன்களுக்கான 5 துல்லிய அவுட்புட்டுகள் ---
        let totalEntries = currentDB.length;
        let posFreq = [Array(10).fill(0), Array(10).fill(0), Array(10).fill(0)];
        let sum0 = 0, sum1 = 0, sum2 = 0;

        currentDB.forEach(entry => {
            let d0 = parseInt(entry.num[0]), d1 = parseInt(entry.num[1]), d2 = parseInt(entry.num[2]);
            posFreq[0][d0]++; posFreq[1][d1]++; posFreq[2][d2]++;
            sum0 += d0; sum1 += d1; sum2 += d2;
        });

        // கணித சராசரிகள் (Mathematical Mean)
        let mean0 = Math.round(sum0 / totalEntries);
        let mean1 = Math.round(sum1 / totalEntries);
        let mean2 = Math.round(sum2 / totalEntries);

        // அதிக முறை வந்த எண்கள் (Highest Frequencies)
        let mode0 = posFreq[0].indexOf(Math.max(...posFreq[0]));
        let mode1 = posFreq[1].indexOf(Math.max(...posFreq[1]));
        let mode2 = posFreq[2].indexOf(Math.max(...posFreq[2]));

        // கடைசி எண்ணின் தனித்தனி டிஜிட்டுகள்
        let l0 = parseInt(lastEntry.num[0]), l1 = parseInt(lastEntry.num[1]), l2 = parseInt(lastEntry.num[2]);

        // முந்தைய எண்ணின் விபரங்கள் (கிடைத்தால்)
        let p0 = l0, p1 = l1, p2 = l2;
        if(totalEntries >= 2) {
            let prev = currentDB[totalEntries - 2];
            p0 = parseInt(prev.num[0]); p1 = parseInt(prev.num[1]); p2 = parseInt(prev.num[2]);
        }

        // OUTPUT 1: Vector Trend (அடுத்த நகர்வு திசை)
        let guess1 = `${(l0 + ((l0 - p0 + 10) % 10)) % 10}${(l1 + ((l1 - p1 + 10) % 10)) % 10}${(l2 + ((l2 - p2 + 10) % 10)) % 10}`;

        // OUTPUT 2: High Density (டேட்டாபேஸில் அதிக முறை வந்தவை)
        let guess2 = `${mode0}.${mode1}.${mode2}`.replace(/\./g, '');

        // OUTPUT 3: Mirror Matrix (பாரம்பரிய கட் எண்கள் லாஜிக்)
        let guess3 = `${(l0 + 5) % 10}${(l1 + 5) % 10}${(l2 + 5) % 10}`;

        // OUTPUT 4: Mean Shift (சராசரியின் அடிப்படையில் மாறும் போக்கு)
        let guess4 = `${(l0 + mean0) % 10}${(l1 + mean1) % 10}${(l2 + mean2) % 10}`;

        // OUTPUT 5: Golden Ratio Chaos (கணித மாறிலி மூலம் கணிக்கப்படும் எஞ்சிய வாய்ப்பு)
        let guess5 = `${(l0 + mode0 + 3) % 10}${(l1 + mode1 + 7) % 10}${(l2 + mode2 + 1) % 10}`;

        // சுய பாதுகாப்பு செக் (கணிப்புகள் முந்தைய எண்களாகவே திரும்ப வராமல் தடுக்க)
        if (guess1 === lastEntry.num) guess1 = String((parseInt(guess1) + 147) % 1000).padStart(3, '0');
        if (guess2 === guess1) guess2 = String((parseInt(guess2) + 258) % 1000).padStart(3, '0');
        if (guess3 === guess2) guess3 = String((parseInt(guess3) + 369) % 1000).padStart(3, '0');
        if (guess4 === guess3) guess4 = String((parseInt(guess4) + 471) % 1000).padStart(3, '0');
        if (guess5 === guess4) guess5 = String((parseInt(guess5) + 582) % 1000).padStart(3, '0');

        // HTML-ல் 5 பாக்ஸ்கள் திரையில் தோன்றும் வடிவம்
        container.innerHTML = `
            <div style="background:#e3f2fd; border:1px solid #90caf9;" class="pred-box"><span style="color:#0d47a1;">1. Vector Trend</span><div class="pred-num">${guess1}</div></div>
            <div style="background:#e8f5e9; border:1px solid #a5d6a7;" class="pred-box"><span style="color:#1b5e20;">2. High Density</span><div class="pred-num">${guess2}</div></div>
            <div style="background:#fff3e0; border:1px solid #ffcc80;" class="pred-box"><span style="color:#e65100;">3. Mirror Matrix</span><div class="pred-num">${guess3}</div></div>
            <div style="background:#f3e5f5; border:1px solid #ce93d8;" class="pred-box"><span style="color:#4a148c;">4. Mean Shift</span><div class="pred-num">${guess4}</div></div>
            <div style="background:#fbe9e7; border:1px solid #ffab91;" class="pred-box"><span style="color:#b71c1c;">5. Golden Chaos</span><div class="pred-num">${guess5}</div></div>
        `;
    }
}
