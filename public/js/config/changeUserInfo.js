const newFullName = document.getElementById('new-full-name');
const newEmail = document.getElementById('new-email');
const confirmPassword = document.getElementById('confirm-password');
const warningPassword = document.querySelector('.warning-password');
const submitNewData = document.getElementById('submit-new-data');
const changeDataResult = document.querySelector('.change-data-result');

submitNewData.addEventListener('click', async(e) => {
    e.preventDefault();
    //Fetch current password sent and compare with account password on server
    const checkResponse = await fetch(`${location}/check-password`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "password": confirmPassword.value
        })
    })
    const dataCheck = await checkResponse.json();
    if (dataCheck.res === false) {
        warningPassword.classList.add('warning-active');
        warningPassword.innerHTML = "La contraseña ingresada no coincide con la de la cuenta";
        return;
    }

    let newData = {};
    if (newFullName.value) newData.newFullName = newFullName.value;
    if (newEmail.value) newData.newEmail = newEmail.value;
    if (newData) {
        const response = await fetch(`${location}/update-user-data`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        const data = await response.json();
        //console.log(data);
        if (data.success) {
            changeDataResult.innerHTML = "Se han modificado los datos correctamente";
            changeDataResult.classList.add('success-active')
            warningCurrentPassword.classList.remove('warning-active');
        }
        else {
            changeDataResult.classList.add('warning-active')
            changeDataResult.innerHTML = `Ha ocurrido un error al modificar la contraseña: ${data.error}`;
        }
    }
})