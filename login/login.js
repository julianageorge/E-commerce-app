const openform = document.getElementById('open');
const home = document.querySelector('.home');
const container = document.querySelector(".container");
const signup = document.getElementById("signup");
const login = document.getElementById("loginbtn");
const closeform = document.querySelector(".close");
const loginForm = document.querySelector(".login form");
const signupForm = document.querySelector(".signupform form");
const forgotPasswordLink = document.querySelector(".forget");
const forgotPasswordForm = document.querySelector(".forgetpass");
const resetPasswordForm = document.getElementById("forgetpass_form");
const backToLogin = document.getElementById("backToLogin");
const welcomeGreeting = document.getElementById('welcomeGreeting');
const closeGreetingButton = document.getElementById('closeGreetingButton');



openform.addEventListener("click", () => {
    home.classList.add("show");
});

closeform.addEventListener("click", () => {
    home.classList.remove("show");
});

signup.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("activesignup");
});

login.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("activesignup");
});

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupForm.querySelector("input[type='email']").value;
    const password = signupForm.querySelector("input[type='password']").value;
    const confirmPassword = signupForm.querySelectorAll("input[type='password']")[1].value;
    const type = document.getElementById("signupUserType").value;

    if (!Validform(email, password, confirmPassword, type)) {
        return;
    }

    if (userExists(email)) {
        alert("User already exists. Please login.");
        container.classList.remove("activesignup");
        return;
    }

    saveUser(email, password, type);
    alert("Sign-up successful! Please login.");
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("userType").value;
    const email = loginForm.querySelector("input[type='email']").value;
    const password = loginForm.querySelector("input[type='password']").value;

    if (!Validform(email, password, null, type)) {
        return;
    }

    const user = getUser(email);
    if (!user) {
        alert("User not found. Please sign up.");
        return;
    }

    if (user.password !== password || user.type !== type) {
        alert("Incorrect email, password, or user type.");
        return;
    }

    alert("Login successful!");

    if (user.type === "admin") {
        window.location.href = "../admin/index.html"; 
    } else if (user.type === "customer") {
        window.location.href = "../customer/index.html"; 
    }
});

function Validform(email, password, confirmPassword = null, userType) {
    if (!email || !password || !userType) {
        alert("All fields are required.");
        return false;
    }
    if (confirmPassword !== null && password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    if(password.length<10){
        alert("Password is too weak.");
        return false;
    }
    return true;
}

function userExists(email) {
    return !!localStorage.getItem(email);
}

function saveUser(email, password, type) {
    const user = { email, password, type };
    localStorage.setItem(email, JSON.stringify(user));
}

function getUser(email) {
    const user = localStorage.getItem(email);
    return user ? JSON.parse(user) : null;
}
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("forgotpassword-active");
});

backToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("forgotpassword-active");
});
resetPasswordForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.getElementById("resetEmail").value;
    if(!email){
        alert("Please enter your email.");
        return;
    }
    if(!userExists(email)){
        alert("No account found with that email address.");
        return;
    }
    alert("A password reset link has been sent to your email.");
    document.getElementById("resetEmail").value = "";

})

document.addEventListener("DOMContentLoaded", function () {    
    welcomeGreeting.style.display = 'block';
    closeGreetingButton.addEventListener('click', () => {
        welcomeGreeting.style.display = 'none';
        home.classList.add("show");
    });
    openform.addEventListener('click',()=>{
        welcomeGreeting.style.display='none';
        home.classList.add("show");
    })
});
