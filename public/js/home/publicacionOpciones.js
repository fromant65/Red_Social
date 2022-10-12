const matchAutorPublicacion = async(id)=>{
    const userid = await getUserId();
    const response = await fetch(`${location}/match-autores`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid":id,
            "userid":userid
        })
    })
    const data = await response.json();
    return data.match //El fetch devuelve un json que tiene un atributo match que es true o false
}

const generarPublicacionOpciones = async(id, div)=>{
    const opciones = div;
    const opcionesContainer = document.createElement('div');
    if(await matchAutorPublicacion(id)) {
        const eliminarPost = document.createElement('div');
        eliminarPost.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar publicación.'
        eliminarPost.addEventListener('click', async ()=>{
            const response = await fetch(`${location}/eliminar-post`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "postid":id
                })
            })
            const resultado = await response.json();
            if(resultado.success) document.getElementById(id).parentNode.removeChild(document.getElementById(id))
            else alert('No se pudo eliminar la publicación: '+ resultado.message)
        })
        opcionesContainer.appendChild(eliminarPost);
    }
    opciones.appendChild(opcionesContainer);
}