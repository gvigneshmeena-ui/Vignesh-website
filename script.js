let generatedOTP = "";

function showSignup(){
  document.getElementById("signupBox").style.display = "block";
  document.getElementById("signinBox").style.display = "none";
}

function showSignin(){
  document.getElementById("signinBox").style.display = "block";
  document.getElementById("signupBox").style.display = "none";
}

function generateOTP(){

  generatedOTP = Math.floor(1000 + Math.random() * 9000);

  document.getElementById("otpDisplay").innerText =
    "OTP : " + generatedOTP;
}

function createAccount(){

  let mobile =
    document.getElementById("signupMobile").value;

  let password =
    document.getElementById("signupPassword").value;

  let confirm =
    document.getElementById("signupConfirm").value;

  let otp =
    document.getElementById("otpInput").value;

  if(password !== confirm){
    alert("Password not match");
    return;
  }

  if(otp != generatedOTP){
    alert("Wrong OTP");
    return;
  }

  localStorage.setItem("mobile", mobile);
  localStorage.setItem("password", password);

  alert("Account Created Successfully");

}

function signin(){

  let mobile =
    document.getElementById("signinMobile").value;

  let password =
    document.getElementById("signinPassword").value;

  let savedMobile =
    localStorage.getItem("mobile");

  let savedPassword =
    localStorage.getItem("password");

  if(
    mobile === savedMobile &&
    password === savedPassword
  ){

    window.location.href = "welcome.html";

  }else{

    alert("Invalid Login");

  }

}