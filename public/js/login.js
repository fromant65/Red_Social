const user = document.getElementById('username');
const pwd = document.getElementById('password');
const submit = document.getElementById("submit");
const resultado = document.querySelector(".resultado");

const loginError = (message)=>{
    //Esta funcion crea la estructura html de un mensaje de error de login (si lo hay)
    //Y la agrega al DOM
    resultado.innerHTML='';
    const div = document.createElement('div');
    div.innerHTML = message;
    div.style.color = "#ee4040";
    div.style.display = "block";
    const linkInicio = document.createElement('A');
    linkInicio.setAttribute('href', '/');
    linkInicio.innerHTML = "Volver a la página de inicio.";
    linkInicio.style.display = "block";
    resultado.appendChild(div);
    resultado.appendChild(linkInicio);
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
    }).then(response => {
        if(response.url==location.href){
            return response.json();
        }else return JSON.stringify({login:true}); 
        //Si el login no se cumplió, el fetch devuelve un response cuya url es login
        //Entonces, si la url del response es la misma que la de la página actual (login),
        //quiere decir que hubo un error, asi que lo devolvemos como json para mostrarlo.
        //Sino, el login se completó y podemos retornar un login:true y redireccionar a home
    })
    .then(data => {
        if(data.message) {
            //Desde el servidor, cuando hay un error se envía en un JSON con un atributo message
            loginError(data.message);
            return;
        }else{
            location.href = '/home';
        }
    }).catch(err=>{
        loginError(err);
    });
})