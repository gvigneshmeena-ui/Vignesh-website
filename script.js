
let currentUser = localStorage.getItem("currentUser") || "";

function login(){
  const user = document.getElementById("username").value;
  if(!user){
    alert("Enter username");
    return;
  }
  currentUser = user;
  localStorage.setItem("currentUser", user);
  alert("Login successful");
  loadHistory();
}

function getData(){
  return JSON.parse(localStorage.getItem("lotteryData") || "[]");
}

function saveData(data){
  localStorage.setItem("lotteryData", JSON.stringify(data));
}

function saveResult(){
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const result = document.getElementById("result").value;

  if(result.length !== 3){
    alert("Enter 3 digit number");
    return;
  }

  let data = getData();
  data.push({date,time,result});
  saveData(data);

  loadHistory();
  alert("Result saved permanently");
}

function loadHistory(){
  let data = getData();
  const table = document.getElementById("history");
  table.innerHTML = "";

  data.forEach(item=>{
    table.innerHTML += `
      <tr>
        <td>${item.date}</td>
        <td>${item.time}</td>
        <td>${item.result}</td>
      </tr>
    `;
  });
}

function analyze(){
  let data = getData();

  if(data.length < 2){
    alert("Add more data");
    return;
  }

  let freq = {};
  data.forEach(d=>{
    d.result.split("").forEach(n=>{
      freq[n] = (freq[n] || 0) + 1;
    });
  });

  let sorted = Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let prediction = sorted.join("");

  document.getElementById("prediction").innerHTML = `
    <h3>Predicted Number: ${prediction}</h3>
    <p>Based on repeat digit frequency analysis</p>
  `;
}

loadHistory();
