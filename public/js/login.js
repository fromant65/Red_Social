const user = document.getElementById('username');
const pwd = document.getElementById('password');
const submit = document.getElementById("submit");
const resultado = document.querySelector(".resultado");

const loginError = (message)=>{
    resultado.innerHTML='';
    const h2 = document.createElement('H2');
    h2.innerHTML = message;
    h2.style.color = "#ee4040";
    h2.style.display = "block";
    const linkInicio = document.createElement('A');
    linkInicio.setAttribute('href', '/');
    linkInicio.innerHTML = "Volver a la página de inicio.";
    linkInicio.style.display = "block";
    resultado.appendChild(h2);
    resultado.appendChild(linkInicio);
}

const createForm = (data)=>{
    const form = document.createElement('form');
    form.action='home';
    form.method='post';
    form.name='accessToken';
    form.style.display = 'none';
    const input = document.createElement('input');
    input.name = 'Authorization'
    input.value = data;
    input.type = 'text';
    form.appendChild(input);
    resultado.appendChild(form);
}

submit.addEventListener('click', (e)=>{
    e.preventDefault();
    const username = user.value;
    const password = pwd.value;
    //console.log(user.value, pwd.value);
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
            loginError(data.message);
            return;
        }else{
            location.href = '/home';
        }
    }).catch(err=>{
        loginError(err);
    });
})