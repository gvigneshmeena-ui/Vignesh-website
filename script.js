let lotteryDatabase = JSON.parse(localStorage.getItem('lotteryDB')) || [];
let editIndex = null; 

window.onload = function() {
    setDefaultDateTime();
    runEngine();
};

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
    const num = document.getElementById('d1').value + document.getElementById('d2').value + document.getElementById('d3').value;

    if(num.length !== 3 || isNaN(num)) {
        alert("தயவுசெய்து சரியான 3 இலக்க எண் உள்ளிடவும்!");
        return;
    }

    const entryData = { date, time, gameId, num };

    if (editIndex !== null) {
        lotteryDatabase[editIndex] = entryData;
        editIndex = null;
        document.getElementById('submitBtn').innerText = "SAVE & ANALYZE (சேமி & பகுப்பாய்)";
        document.getElementById('submitBtn').style.background = "#28a745";
        document.getElementById('formTitle').innerText = "1. Data Input (தரவு உள்ளீடு)";
        document.getElementById('inputPanel').classList.remove('edit-mode');
    } else {
        lotteryDatabase.push(entryData);
    }
    
    localStorage.setItem('lotteryDB', JSON.stringify(lotteryDatabase));
    
    document.getElementById('d1').value = '';
    document.getElementById('d2').value = '';
    document.getElementById('d3').value = '';
    document.getElementById('gameId').value = '';
    setDefaultDateTime();
    document.getElementById('d1').focus();

    runEngine();
});

function editRow(index) {
    editIndex = index;
    let entry = lotteryDatabase[index];

    document.getElementById('gameDate').value = entry.date;
    document.getElementById('gameTime').value = entry.time;
    document.getElementById('gameId').value = entry.gameId;
    document.getElementById('d1').value = entry.num[0];
    document.getElementById('d2').value = entry.num[1];
    document.getElementById('d3').value = entry.num[2];

    document.getElementById('submitBtn').innerText = "UPDATE NUMBER (மாற்றங்களைச் சேமி)";
    document.getElementById('submitBtn').style.background = "#ffc107";
    document.getElementById('submitBtn').style.color = "#333";
    document.getElementById('formTitle').innerText = "📝 Editing Row Mode (திருத்தும் முறை)";
    document.getElementById('inputPanel').classList.add('edit-mode');
    
    document.getElementById('inputPanel').scrollIntoView({ behavior: 'smooth' });
}

function deleteRow(index) {
    if(confirm("இந்த குறிப்பிட்ட எண்களை மட்டும் நீக்க வேண்டுமா?")) {
        if(editIndex === index) {
            editIndex = null;
            document.getElementById('submitBtn').innerText = "SAVE & ANALYZE (சேமி & பகுப்பாய்)";
            document.getElementById('submitBtn').style.background = "#28a745";
            document.getElementById('formTitle').innerText = "1. Data Input (தரவு உள்ளீடு)";
            document.getElementById('inputPanel').classList.remove('edit-mode');
        }
        lotteryDatabase.splice(index, 1);
        localStorage.setItem('lotteryDB', JSON.stringify(lotteryDatabase));
        runEngine();
    }
}

function clearAllData() {
    if(confirm("நிச்சயமாக அனைத்து தரவுகளையும் முற்றிலும் அழிக்க வேண்டுமா?")) {
        localStorage.removeItem('lotteryDB');
        lotteryDatabase = [];
        editIndex = null;
        runEngine();
    }
}

function runEngine() {
    renderTable();
    if(lotteryDatabase.length === 0) {
        document.getElementById('patternAnalysis').innerHTML = "<p style='color: #666;'>டேட்டா எதுவும் இல்லை.</p>";
        document.getElementById('predictionContainer').innerHTML = `
            <div class="pred-num">---</div>
            <div class="pred-num">---</div>
            <div class="pred-num">---</div>
        `;
        return;
    }
    analyzePatterns();
    generatePredictions();
}

function renderTable() {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    for (let i = lotteryDatabase.length - 1; i >= 0; i--) {
        let entry = lotteryDatabase[i];
        let numInt = parseInt(entry.num);
        let prevNum = String(numInt === 0 ? 999 : numInt - 1).padStart(3, '0');
        let nextNum = String(numInt === 999 ? 0 : numInt + 1).padStart(3, '0');

        const row = `<tr>
            <td>${entry.date} (${entry.time})</td>
            <td>${entry.gameId}</td>
            <td style="font-weight:bold; color:#1a237e; font-size:16px;">${entry.num}</td>
            <td><span style="color:#777">${prevNum}</span> ← <b>${entry.num}</b> → <span style="color:#777">${nextNum}</span></td>
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

    if(lotteryDatabase.length < 2) {
        container.innerHTML = "<p style='color:#666;'>பேட்டர்ன்களைக் கண்டறிய குறைந்தது 2 எண்களாவது தேவை.</p>";
        return;
    }

    for(let i = 1; i < lotteryDatabase.length; i++) {
        let current = lotteryDatabase[i];
        let previous = lotteryDatabase[i-1];
        
        let c0 = parseInt(current.num[0]), c1 = parseInt(current.num[1]), c2 = parseInt(current.num[2]);
        let p0 = parseInt(previous.num[0]), p1 = parseInt(previous.num[1]), p2 = parseInt(previous.num[2]);

        let timeContext = `${current.date} [Game:${current.gameId}]`;

        if(current.num === previous.num) {
            reports.push(`<div class="analysis-card"><span class="badge bg-rep">REPEAT</span> <b>${timeContext}:</b> முந்தைய கேமின் அதே எண் <b>${current.num}</b> மீண்டும் வந்துள்ளது!</div>`);
        }
        if(c0 === p0 + 1 && c1 === p1 + 1 && c2 === p2 + 1) {
            reports.push(`<div class="analysis-card"><span class="badge bg-inc">ALL INC</span> <b>${timeContext}:</b> அனைத்து எண்களும் அதிகரித்துள்ளது (${previous.num} ➔ ${current.num}).</div>`);
        }
        if(c0 === p0 + 1) {
            reports.push(`<div class="analysis-card"><span class="badge bg-inc">POS 1 INC</span> <b>${timeContext}:</b> முதல் டிஜிட் <b>${p0}</b>-ல் இருந்து <b>${c0}</b> ஆக உயர்ந்துள்ளது.</div>`);
        }
        if(c1 === p0 + 1 || c2 === p1 + 1) {
            reports.push(`<div class="analysis-card"><span class="badge bg-inc">CROSS INC</span> <b>${timeContext}:</b> பக்கவாட்டில் (Cross/Side) எண்கள் அதிகரித்துள்ளது! (${previous.num} ➔ ${current.num})</div>`);
        }
        if(c0 === p0 - 1 || c1 === p1 - 1 || c2 === p2 - 1) {
            reports.push(`<div class="analysis-card"><span class="badge bg-dec">DECREASE</span> <b>${timeContext}:</b> எண்கள் முந்தைய கேமை விடக் குறைந்துள்ளன. (${previous.num} ➔ ${current.num})</div>`);
        }

        let currentHour = parseInt(current.time.split(':')[0]);
        let prevHour = parseInt(previous.time.split(':')[0]);
        let currentAmpm = currentHour >= 12 ? 'PM' : 'AM';
        let prevAmpm = prevHour >= 12 ? 'PM' : 'AM';

        if(currentAmpm !== prevAmpm && (c0 === p0 + 1 || c1 === p1 + 1)) {
            reports.push(`<div class="analysis-card"><span class="badge bg-inc">TIME SHIFT PATTERN</span> <b>${previous.date} (${prevAmpm})</b>-ல் இருந்து <b>${current.date} (${currentAmpm})</b> ஆகும் போது எண்கள் கூடியுள்ளது.</div>`);
        }
    }

    if(reports.length === 0) {
        container.innerHTML = "<p style='color:#28a745;'><b>சிக்னல்:</b> தற்போதைக்கு நேரடி மாற்றங்கள் மட்டுமே உள்ளன.</p>";
    } else {
        reports.reverse().forEach(r => container.innerHTML += r);
    }
}

function generatePredictions() {
    if(lotteryDatabase.length === 0) return;

    let lastEntry = lotteryDatabase[lotteryDatabase.length - 1];
    let l0 = parseInt(lastEntry.num[0]), l1 = parseInt(lastEntry.num[1]), l2 = parseInt(lastEntry.num[2]);

    let g1_0 = (l0 + 1) % 10; let g1_1 = (l1 + 1) % 10; let g1_2 = (l2 + 1) % 10;
    let guess1 = `${g1_0}${g1_1}${g1_2}`;

    let g2_0 = Math.abs(9 - l0); let g2_1 = (l1 + 2) % 10; let g2_2 = Math.abs(9 - l2);
    let guess2 = `${g2_0}${g2_1}${g2_2}`;

    let g3_0 = l1; let g3_1 = l2; let g3_2 = (l0 + 3) % 10;
    let guess3 = `${g3_0}${g3_1}${g3_2}`;

    const container = document.getElementById('predictionContainer');
    container.innerHTML = `
        <div><span style="font-size:12px; display:block; text-align:center; color:#555;">Option 1 (Trend)</span><div class="pred-num">${guess1}</div></div>
        <div><span style="font-size:12px; display:block; text-align:center; color:#555;">Option 2 (Mirror)</span><div class="pred-num">${guess2}</div></div>
        <div><span style="font-size:12px; display:block; text-align:center; color:#555;">Option 3 (Cross)</span><div class="pred-num">${guess3}</div></div>
    `;
}
