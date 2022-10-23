const divSeguimiento = document.querySelector('.seguimiento');
const seguir = document.querySelector('.seguir');
const searchParams = new URLSearchParams(document.location.search)
const usernamePerfil = searchParams.get('username');

const determinarSeguimiento = async () => {
    const userid = await getUserId();
    if (!usernamePerfil || usernamePerfil===userid) return 'misma-persona';
    const data = await fetch(`/user-info/${usernamePerfil}`);
    const usuario = await data.json();
    const seguidores = usuario.user.followers;
    //console.log(seguidores);
    const seguido = seguidores.filter(seguidor=> seguidor.username===userid);
    if(seguido.length === 1) return 'seguido';
    else return 'no-seguido';
}

seguir.addEventListener('click', async()=>{
    const userid = await getUserId();
    const req = await fetch(`/profile/seguir`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userFollowed": usernamePerfil,
            "client": userid
        })
    })
    const data = await req.json();
    if(data.success){
        generarBotonCorrespondiente();
    }
})

const generarBotonCorrespondiente = async ()=>{
    const relacion = await determinarSeguimiento();
    if(relacion === 'misma-persona') eliminarDiv();
    else contenidoSeguir(relacion);
}

const eliminarDiv = ()=>{
    divSeguimiento.style.display = 'none';
    divSeguimiento.style.position = 'absolute';
}

const contenidoSeguir = (relacion)=>{
    if(relacion === 'seguido'){
        seguir.innerText = 'Dejar de seguir';
        seguir.classList.add('seguido')
        seguir.classList.remove('no-seguido')
    }else{
        seguir.innerText = 'Seguir';
        seguir.classList.add('no-seguido')
        seguir.classList.remove('seguido')
    }
}

generarBotonCorrespondiente();