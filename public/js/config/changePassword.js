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
    const response = await fetch(`${location}/check-password`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "password":passActual.value
        })
    })
    const dataCheck = await response.json();
    //console.log(dataCheck);
    if(dataCheck.res === false){
        warningCurrentPassword.classList.add('warning-active');
        warningCurrentPassword.innerHTML = "La contraseña ingresada no coincide con la de la cuenta";
    }
    if(passActual.value === newPass1.value && newPass1.value === newPass2.value){
        warningNewPasswords.classList.add('warning-active')
        warningNewPasswords.innerHTML = "Las nueva contraseña y la actual deben ser distintas";
        return;
    } 
    if(dataCheck.res === true && newPass1.value === newPass2.value){
        //Update password
        const response = await fetch(`${location}/update-password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "password":newPass1.value
            })
        })
        const data = await response.json();
        //console.log(data);
        if(data.success) {
            changePasswordResult.innerHTML = "Se ha modificado la contraseña correctamente";
            changePasswordResult.classList.add('success-active')
            warningNewPasswords.classList.remove('warning-active')
            warningCurrentPassword.classList.remove('warning-active');
        }
        else {
            changePasswordResult.classList.add('warning-active')
            changePasswordResult.innerHTML = `Ha ocurrido un error al modificar la contraseña: ${data.error}`;
        }
    }
})