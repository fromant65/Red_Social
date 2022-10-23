const passActual = document.getElementById("pass-actual");
const warningCurrentPassword = document.querySelector(".warning-current-password");
const newPass1 = document.getElementById("new-pass-1");
const newPass2 = document.getElementById("new-pass-2");
const warningNewPasswords = document.querySelector(".warning-new-passwords");
const submitNewPass = document.getElementById("submit-new-pass");
const changePasswordResult= document.querySelector(".change-password-result");

newPass2.addEventListener('input', ()=>{
    if(newPass2.value !== newPass1.value){
        warningNewPasswords.classList.add('warning-active')
        warningNewPasswords.innerHTML = "Las contraseñas deben coincidir";
    }else{
        warningNewPasswords.classList.remove('warning-active')
        warningNewPasswords.innerHTML = "";
    }
});

submitNewPass.addEventListener('click', async(e)=>{
    e.preventDefault();
    //Fetch current password sent and compare with account password on server
    const req = await fetch(`${location}/check-password`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "password":passActual.value
        })
    })
    const res = await req.json();
    //console.log(res);
    if(res.res === false){
        warningCurrentPassword.classList.add('warning-active');
        warningCurrentPassword.innerHTML = "La contraseña ingresada no coincide con la de la cuenta";
    }
    if(passActual.value === newPass1.value && newPass1.value === newPass2.value){
        warningNewPasswords.classList.add('warning-active')
        warningNewPasswords.innerHTML = "Las nueva contraseña y la actual deben ser distintas";
        return;
    } 
    if(res.res === true && newPass1.value === newPass2.value){
        //Update password
        const req = await fetch(`${location}/update-password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "password":newPass1.value
            })
        })
        const res = await req.json();
        //console.log(res);
        if(res.success) {
            changePasswordResult.innerHTML = "Se ha modificado la contraseña correctamente";
            changePasswordResult.classList.add('success-active')
            warningNewPasswords.classList.remove('warning-active')
            warningCurrentPassword.classList.remove('warning-active');
        }
        else {
            changePasswordResult.classList.add('warning-active')
            changePasswordResult.innerHTML = `Ha ocurrido un error al modificar la contraseña: ${res.error}`;
        }
    }
})