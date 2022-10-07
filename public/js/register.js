const user = document.getElementById('username');
const pwd = document.getElementById('password');
const submit = document.getElementById("submit");
const resultado = document.querySelector(".resultado");

const successMessage = ()=>{
    //Esta funcion crea la estructura HTML de un mensaje de éxito 
    //Y la agrega al DOM
    const h2 = document.createElement('h2');
    h2.innerHTML = "La cuenta se ha creado correctamente.";
    h2.style.color = "#40ee40";
    h2.style.display = "block";
    const linkLogin = document.createElement('A');
    linkLogin.setAttribute('href', '/');
    linkLogin.innerHTML = "Volver a la página de inicio.";
    linkLogin.style.display = "block";
    resultado.innerHTML='';
    resultado.appendChild(h2);
    resultado.appendChild(linkLogin);
}

const errorMessage = (message)=>{
    //Esta funcion crea la estructura HTML de un mensaje de error 
    //Y la agrega al DOM
    const h2 = document.createElement('H2');
    h2.innerHTML = `Ha ocurrido un error al crear la cuenta: ${message}`;
    h2.style.color = "#ee4040";
    h2.style.display = "block";
    const linkLogin = document.createElement('A');
    linkLogin.setAttribute('href', '/');
    linkLogin.innerHTML = "Volver a la página de inicio.";
    linkLogin.style.display = "block";
    resultado.innerHTML='';
    resultado.appendChild(h2);
    resultado.appendChild(linkLogin);
}

submit.addEventListener('click', (e)=>{
    e.preventDefault();
    const username = user.value;
    const password = pwd.value;
    fetch(location, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => response.json())
    .then(data => {
        //Si el response tiene un atributo success, entonces se pudo crear la cuenta
        if(data.success) successMessage()
        //Si no, hubo un error y lo mostramos
        else errorMessage(data.message)
    }).catch(err =>{
        errorMessage(err);
    })
})