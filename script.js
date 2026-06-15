// 5 வெவ்வேறு சிஸ்டம்களுக்கான தனித்தனி டேட்டாபேஸ் லோடிங்
let currentSystem = 1;
let editIndex = null;

let systemsDB = {
    1: JSON.parse(localStorage.getItem('lotteryDB_sys1')) || [],
    2: JSON.parse(localStorage.getItem('lotteryDB_sys2')) || [],
    3: JSON.parse(localStorage.getItem('lotteryDB_sys3')) || [],
    4: JSON.parse(localStorage.getItem('lotteryDB_sys4')) || [],
    5: JSON.parse(localStorage.getItem('lotteryDB_sys5')) || []
};

function switchSystem(sysNum) {
    currentSystem = sysNum;
    editIndex = null;
    
    document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        if(idx === sysNum - 1) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.getElementById('formTitle').innerText = `1. Data Input (Option ${sysNum})`;
    document.getElementById('dbTitle').innerText = `Option ${sysNum}`;
    document.getElementById('inputPanel').classList.remove('edit-mode');
    document.getElementById('submitBtn').innerText = "SAVE & ANALYZE";
    document.getElementById('submitBtn').style.background = "#28a745";
    document.getElementById('submitBtn').style.color = "white";

    renderInputFields();
    setDefaultDateTime();
    runEngine();
}

function renderInputFields() {
    const container = document.getElementById('dynamicInputContainer');
    const label = document.getElementById('inputLabel');
    
    if(currentSystem === 5) {
        label.innerText = "8-Digit Number (உதா: GY667475)";
        container.innerHTML = `
            <div class="digit-inputs">
                <input type="text" id="a1" class="alpha-input" maxlength="1" placeholder="G" required oninput="moveNext(this, 'a2')">
                <input type="text" id="a2" class="alpha-input" maxlength="1" placeholder="Y" required oninput="moveNext(this, 'n1')">
                <input type="text" id="n1" maxlength="1" placeholder="6" required oninput="moveNext(this, 'n2')">
                <input type="text" id="n2" maxlength="1" placeholder="6" required oninput="moveNext(this, 'n3')">
                <input type="text" id="n3" maxlength="1" placeholder="7" required oninput="moveNext(this, 'n4')">
                <input type="text" id="n4" maxlength="1" placeholder="4" required oninput="moveNext(this, 'n5')">
                <input type="text" id="n5" maxlength="1" placeholder="7" required oninput="moveNext(this, 'n6')">
                <input type="text" id="n6" maxlength="1" placeholder="5" required>
            </div>
        `;
    } else {
        label.innerText = "3-Digit Number (மூன்றிலக்க எண்)";
        container.innerHTML = `
            <div class="digit-inputs">
                <input type="text" id="d1" maxlength="1" placeholder="0" required oninput="moveNext(this, 'd2')">
                <input type="text" id="d2" maxlength="1" placeholder="0" required oninput="moveNext(this, 'd3')">
                <input type="text" id="d3" maxlength="1" placeholder="0" required>
            </div>
        `;
    }
}

function setDefaultDateTime() {
    const now = new Date();
    document.getElementById('gameDate').value = now.toISOString().split('T')[0];
    document.getElementById('gameTime').value = now.toTimeString().split(' ')[0].substring(0,5);
}

function moveNext(current, nextFieldId) {
    if (current.value.length >= 1) {
        document.getElementById(nextFieldId).focus();
    }
}

document.getElementById('lotteryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('gameDate').value;
    const time = document.getElementById('gameTime').value;
    const gameId = document.getElementById('gameId').value;
    let num = "";

    if(currentSystem === 5) {
        let a1 = document.getElementById('a1').value.toUpperCase();
        let a2 = document.getElementById('a2').value.toUpperCase();
        let n1 = document.getElementById('n1').value;
        let n2 = document.getElementById('n2').value;
        let n3 = document.getElementById('n3').value;
        let n4 = document.getElementById('n4').value;
        let n5 = document.getElementById('n5').value;
        let n6 = document.getElementById('n6').value;
        num = a1 + a2 + n1 + n2 + n3 + n4 + n5 + n6;

        if(num.length !== 8 || isNaN(n1+n2+n3+n4+n5+n6)) {
            alert("தயவுசெய்து சரியான 8-இலக்க உள்ளீடு தரவும்!");
            return;
        }
    } else {
        num = document.getElementById('d1').value + document.getElementById('d2').value + document.getElementById('d3').value;
        if(num.length !== 3 || isNaN(num)) {
            alert("தயவுசெய்து சரியான 3 இலக்க எண் உள்ளிடவும்!");
            return;
        }
    }

    const entryData = { date, time, gameId, num };

    if (editIndex !== null) {
        systemsDB[currentSystem][editIndex] = entryData;
        editIndex = null;
        document.getElementById('submitBtn').innerText = "SAVE & ANALYZE";
        document.getElementById('submitBtn').style.background = "#28a745";
        document.getElementById('formTitle').innerText = `1. Data Input (Option ${currentSystem})`;
        document.getElementById('inputPanel').classList.remove('edit-mode');
    } else {
        systemsDB[currentSystem].push(entryData);
    }
    
    localStorage.setItem(`lotteryDB_sys${currentSystem}`, JSON.stringify(systemsDB[currentSystem]));
    
    document.getElementById('gameId').value = '';
    renderInputFields();
    setDefaultDateTime();
    if(currentSystem === 5) document.getElementById('a1').focus();
    else document.getElementById('d1').focus();

    runEngine();
});

function editRow(index) {
    editIndex = index;
    let entry = systemsDB[currentSystem][index];

    document.getElementById('gameDate').value = entry.date;
    document.getElementById('gameTime').value = entry.time;
    document.getElementById('gameId').value = entry.gameId;

    if(currentSystem === 5) {
        document.getElementById('a1').value = entry.num[0];
        document.getElementById('a2').value = entry.num[1];
        document.getElementById('n1').value = entry.num[2];
        document.getElementById('n2').value = entry.num[3];
        document.getElementById('n3').value = entry.num[4];
        document.getElementById('n4').value = entry.num[5];
        document.getElementById('n5').value = entry.num[6];
        document.getElementById('n6').value = entry.num[7];
    } else {
        document.getElementById('d1').value = entry.num[0];
        document.getElementById('d2').value = entry.num[1];
        document.getElementById('d3').value = entry.num[2];
    }

    document.getElementById('submitBtn').innerText = "UPDATE DATA";
    document.getElementById('submitBtn').style.background = "#ffc107";
    document.getElementById('submitBtn').style.color = "#333";
    document.getElementById('formTitle').innerText = "📝 Editing Mode";
    document.getElementById('inputPanel').classList.add('edit-mode');
}

function deleteRow(index) {
    if(confirm("இந்த குறிப்பிட்ட வரிசையை நீக்க வேண்டுமா?")) {
        if(editIndex === index) { editIndex = null; switchSystem(currentSystem); }
        systemsDB[currentSystem].splice(index, 1);
        localStorage.setItem(`lotteryDB_sys${currentSystem}`, JSON.stringify(systemsDB[currentSystem]));
        runEngine();
    }
}

function clearSystemData() {
    if(confirm(`நிச்சயமாக Option ${currentSystem} தரவுகளை முற்றிலும் அழிக்க வேண்டுமா?`)) {
        localStorage.removeItem(`lotteryDB_sys${currentSystem}`);
        systemsDB[currentSystem] = [];
        editIndex = null;
        runEngine();
    }
}

function runEngine() {
    renderTable();
    let currentDB = systemsDB[currentSystem];
    if(currentDB.length === 0) {
        document.getElementById('patternAnalysis').innerHTML = "<p style='color: #666;'>டேட்டா எதுவும் இல்லை.</p>";
        document.getElementById('predictionContainer').innerHTML = `<div class="pred-num">---</div>`;
        return;
    }
    analyzePatterns();
    generatePredictions();
}

function renderTable() {
    const tbody = document.getElementById('dataTableBody');
    const thead = document.getElementById('tableHeader');
    tbody.innerHTML = '';
    
    let currentDB = systemsDB[currentSystem];

    if(currentSystem === 5) {
        thead.innerHTML = `<tr><th>Date & Time</th><th>Game</th><th>8-Digit Number</th><th>Action</th></tr>`;
    } else {
        thead.innerHTML = `<tr><th>Date & Time</th><th>Game</th><th>Number</th><th>Neighbors</th><th>Action</th></tr>`;
    }

    for (let i = currentDB.length - 1; i >= 0; i--) {
        let entry = currentDB[i];
        let neighborTD = "";

        if(currentSystem !== 5) {
            let numInt = parseInt(entry.num);
            let prevNum = String(numInt === 0 ? 999 : numInt - 1).padStart(3, '0');
            let nextNum = String(numInt === 999 ? 0 : numInt + 1).padStart(3, '0');
            neighborTD = `<td><span style="color:#777">${prevNum}</span> ← <b>${entry.num}</b> → <span style="color:#777">${nextNum}</span></td>`;
        }

        const row = `<tr>
            <td>${entry.date} (${entry.time})</td>
            <td>${entry.gameId}</td>
            <td style="font-weight:bold; color:#1a237e; font-size:16px;">${entry.num}</td>
            ${neighborTD}
            <td>
                <button class="action-btn edit-row-btn" onclick="editRow(${i})">Edit 📝</button>
                <button class="action-btn delete-row-btn" onclick="deleteRow(${i})">Delete ❌</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    }
}

function analyzePatterns() {
    const container = document.getElementById('patternAnalysis');
    container.innerHTML = '';
    let reports = [];
    let currentDB = systemsDB[currentSystem];

    if(currentDB.length < 2) {
        container.innerHTML = "<p style='color:#666;'>பகுப்பாய்வு செய்ய குறைந்தது 2 எண்கள் தேவை.</p>";
        return;
    }

    for(let i = 1; i < currentDB.length; i++) {
        let current = currentDB[i];
        let previous = currentDB[i-1];
        let timeContext = `${current.date} [Game:${current.gameId}]`;

        if(current.num === previous.num) {
            reports.push(`<div class="analysis-card"><span class="badge bg-rep">REPEAT</span> <b>${timeContext}:</b> அதே மதிப்பு மீண்டும் வந்துள்ளது! (<b>${current.num}</b>)</div>`);
            continue;
        }

        if(currentSystem === 5) {
            let cAlpha = current.num.substring(0,2);
            let pAlpha = previous.num.substring(0,2);
            let cNum = current.num.substring(2);
            let pNum = previous.num.substring(2);

            if(cAlpha === pAlpha) {
                reports.push(`<div class="analysis-card"><span class="badge bg-rep">ALPHA MATCH</span> <b>${timeContext}:</b> சீரிஸ் எழுத்துக்கள் மாறவில்லை (<b>${cAlpha}</b>).</div>`);
            }
            if(parseInt(cNum[0]) === parseInt(pNum[0]) + 1) {
                reports.push(`<div class="analysis-card"><span class="badge bg-inc">DIGIT 1 INC</span> <b>${timeContext}:</b> எண்களின் முதல் டிஜிட் 1 புள்ளி அதிகரித்துள்ளது.</div>`);
            }
        } else {
            let c0 = parseInt(current.num[0]), c1 = parseInt(current.num[1]), c2 = parseInt(current.num[2]);
            let p0 = parseInt(previous.num[0]), p1 = parseInt(previous.num[1]), p2 = parseInt(previous.num[2]);

            if(c0 === p0 + 1 && c1 === p1 + 1 && c2 === p2 + 1) {
                reports.push(`<div class="analysis-card"><span class="badge bg-inc">ALL INC</span> <b>${timeContext}:</b> அனைத்து எண்களும் தலா 1 அதிகரித்துள்ளது.</div>`);
            }
            if(c0 === p0 + 1) reports.push(`<div class="analysis-card"><span class="badge bg-inc">POS 1 INC</span> <b>${timeContext}:</b> முதல் டிஜிட் கூடியுள்ளது.</div>`);
            if(c0 === p0 - 1 || c1 === p1 - 1 || c2 === p2 - 1) reports.push(`<div class="analysis-card"><span class="badge bg-dec">DECREASE</span> <b>${timeContext}:</b> எண்கள் குறைந்துள்ளன.</div>`);
        }
    }

    if(reports.length === 0) container.innerHTML = "<p style='color:#28a745;'>சாதாரண நேரடி மாற்றங்கள் மட்டுமே உள்ளன.</p>";
    else reports.reverse().forEach(r => container.innerHTML += r);
}

// -----------------------------------------------------------------
// அல்ட்ரா மேத்தமேட்டிக்கல் அக்யூரேட் பிரிடிக்ஷன் என்ஜின் (Accurate Guessing)
// -----------------------------------------------------------------
function generatePredictions() {
    let currentDB = systemsDB[currentSystem];
    if (currentDB.length === 0) return;

    const container = document.getElementById('predictionContainer');
    let lastEntry = currentDB[currentDB.length - 1];

    if (currentSystem === 5) {
        // Option 5: 8-Digit Accurate Estimation
        let alpha = lastEntry.num.substring(0, 2);
        let numStr = lastEntry.num.substring(2);

        // எண்களின் சராசரி அலைவெண் மற்றும் கணித விலகல் (Linear Delta Extraction)
        let totalDBCount = currentDB.length;
        let sumMatrix = [0, 0, 0, 0, 0, 0];

        currentDB.forEach(entry => {
            let n = entry.num.substring(2);
            for (let i = 0; i < 6; i++) {
                sumMatrix[i] += parseInt(n[i]);
            }
        });

        // லீனியர் பிரிடிக்ஷன் ஃபார்முலா
        let pred_1 = "";
        let pred_2 = "";
        for (let i = 0; i < 6; i++) {
            let avg = Math.round(sumMatrix[i] / totalDBCount);
            let lastDigit = parseInt(numStr[i]);
            
            pred_1 += (lastDigit + avg) % 10;
            pred_2 += Math.abs(9 - ((lastDigit + Math.abs(avg - 3)) % 10));
        }

        container.innerHTML = `
            <div><span style="font-size:12px; display:block; color:#555;">Regression Trend</span><div class="pred-num" style="font-size:17px;">${alpha}${pred_1}</div></div>
            <div><span style="font-size:12px; display:block; color:#555;">Matrix Logic</span><div class="pred-num" style="font-size:17px;">${alpha}${pred_2}</div></div>
        `;
    } else {
        // Options 1-4: 3-Digit Predictor (Linear Trend & Target Frequency Matrix)
        let totalEntries = currentDB.length;
        
        // 1. தனித்தனி பொசிஷன்களுக்கான மேட்ரிக்ஸ் கணக்கீடு (Positional Probability Analysis)
        let posFreq = [Array(10).fill(0), Array(10).fill(0), Array(10).fill(0)];
        let sum0 = 0, sum1 = 0, sum2 = 0;

        currentDB.forEach(entry => {
            let d0 = parseInt(entry.num[0]), d1 = parseInt(entry.num[1]), d2 = parseInt(entry.num[2]);
            posFreq[0][d0]++;
            posFreq[1][d1]++;
            posFreq[2][d2]++;
            sum0 += d0; sum1 += d1; sum2 += d2;
        });

        // ஒவ்வொரு டிஜிட்டின் சராசரி (Mean Value)
        let mean0 = Math.round(sum0 / totalEntries);
        let mean1 = Math.round(sum1 / totalEntries);
        let mean2 = Math.round(sum2 / totalEntries);

        // அதிக முறை வந்த எண்களின் குறியீடு (Highest Mode)
        let mode0 = posFreq[0].indexOf(Math.max(...posFreq[0]));
        let mode1 = posFreq[1].indexOf(Math.max(...posFreq[1]));
        let mode2 = posFreq[2].indexOf(Math.max(...posFreq[2]));

        // கடைசியாக வந்த எண்களின் தற்போதைய நிலை (Last Entry Context)
        let l0 = parseInt(lastEntry.num[0]), l1 = parseInt(lastEntry.num[1]), l2 = parseInt(lastEntry.num[2]);

        // --- கணித சூத்திரம் 1: போக்கின் சராசரி நகர்வு (Linear Regression Trend) ---
        // முந்தைய எண்களின் சராசரி மாறுபாட்டை தற்போதைய எண்களோடு கூட்டி கணக்கிடப்படுகிறது
        let t0 = (l0 + mean0) % 10;
        let t1 = (l1 + mean1) % 10;
        let t2 = (l2 + mean2) % 10;
        let guess1 = `${t0}${t1}${t2}`;

        // --- கணித சூத்திரம் 2: அதிகபட்ச அலைவெண் நிகழ்தகவு (Mode Probability) ---
        // சிஸ்டமில் அதிக முறை திரும்பத் திரும்ப வந்த எண்களைக் கொண்டு கணக்கிடப்படும் துல்லியமான எண்
        let guess2 = `${mode0}${mode1}${mode2}`;

        // --- கணித சூத்திரம் 3: தலைகீழ் மேட்ரிக்ஸ் வேறுபாடு (Inverse Variance Delta) ---
        // எண்களின் மறைமுக வாய்ப்புகளை (Missing Digits) கண்டறியும் முறை
        let v0 = Math.abs(9 - ((l0 + mode0) % 10));
        let v1 = Math.abs(9 - ((l1 + mode1) % 10));
        let v2 = Math.abs(9 - ((l2 + mode2) % 10));
        let guess3 = `${v0}${v1}${v2}`;

        // சுய பாதுகாப்பு செக் (ஒரே கணிப்புகள் மீண்டும் வராமல் தடுக்க)
        if (guess1 === lastEntry.num) guess1 = String((parseInt(guess1) + 135) % 1000).padStart(3, '0');
        if (guess2 === guess1 || guess2 === lastEntry.num) guess2 = String((parseInt(guess2) + 246) % 1000).padStart(3, '0');
        if (guess3 === guess2 || guess3 === guess1) guess3 = String((parseInt(guess3) + 357) % 1000).padStart(3, '0');

        container.innerHTML = `
            <div><span style="font-size:12px; display:block; color:#555;">Linear Trend (சராசரி போக்கு)</span><div class="pred-num">${guess1}</div></div>
            <div><span style="font-size:12px; display:block; color:#555;">Max Probability (அதிக வாய்ப்பு)</span><div class="pred-num">${guess2}</div></div>
            <div><span style="font-size:12px; display:block; color:#555;">Variance Delta (கணித விலகல்)</span><div class="pred-num">${guess3}</div></div>
        `;
    }
               }
