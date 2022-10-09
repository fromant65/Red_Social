//Texto publicación
const publicacion= document.querySelector(".publicacion");
//Submit
const publicar= document.querySelector(".publicar");
publicar.disabled = true;

const submitDisponible = ()=>{
    //Esta funcion activa el boton de publicar
    publicar.disabled = false;
    publicar.classList.add('submit-not-disabled');
}

const submitNoDisponible = ()=>{
    //Esta funcion desactiva el boton de publicar
    publicar.disabled = true;
    publicar.classList.remove('submit-not-disabled')
}

publicacion.addEventListener('input',  (e)=>{
    //Si el textarea de la publicacion no tiene codigo, desactivamos el boton de publicar
    //Si no, lo activamos
    if(e.data!==null) submitDisponible();
    if(publicacion.value=="") submitNoDisponible();
})

publicar.addEventListener("click", async(e)=>{
    e.preventDefault();
    //Obtenemos la data de la sesión 
    //(donde se encuentra el id de usuario con el que identificaremos quién hizo la publicación)
    const request = await fetch(`${location}/publicar`);
    const data = await request.json();
    const fechaPublicacion = new Date();
    //Hacemos la publicación
    fetch(`${location}/publicar`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "user": data.session.userid,
            "content": publicacion.value,
            "date": fechaPublicacion
        })
    })
    location.href=location;
})