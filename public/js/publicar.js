//Texto publicación
const publicacion= document.querySelector(".publicacion");
//Submit
const publicar= document.querySelector(".publicar");
publicar.disabled = true;

const submitDisponible = ()=>{
    publicar.disabled = false;
    publicar.classList.add('submit-not-disabled');
}

const submitNoDisponible = ()=>{
    publicar.disabled = true;
    publicar.classList.remove('submit-not-disabled')
}

publicacion.addEventListener('input',  (e)=>{
    //console.log(e.data + ' . ' + publicacion.value);
    if(e.data!==null) submitDisponible();
    if(publicacion.value=="") submitNoDisponible();
})

publicar.addEventListener("click", async(e)=>{
    e.preventDefault();
    let request = await fetch(`${location}/publicar`);
    let data = await request.json();
    let fechaPublicacion = new Date();
    console.log(data.session.userid);
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
})