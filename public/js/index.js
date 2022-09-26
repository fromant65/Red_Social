const login = document.getElementById("login");
const registrarse = document.getElementById("registrarse");

login.addEventListener('click', ()=>{
    window.location.href = window.location + 'login';
})

registrarse.addEventListener('click', ()=>{
    window.location.href = window.location + 'register';
})