const matchAutorPublicacion = async (id) => {
    //Esta funcion determina si el que intenta abrir las opciones de la publicación y su autor
    //son la misma persona
    const userid = await getUserId();
    const req = await fetch(`home/match-autores`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid": id,
            "userid": userid
        })
    })
    const data = await req.json();
    return data.match //El fetch devuelve un json que tiene un atributo match que es true o false
}

const generarPublicacionOpciones = async (id, div) => {
    //Esta funcion genera el menu de opciones de una publicación
    const opciones = div;
    const opcionesContainer = document.createElement('div');
    opcionesContainer.classList.add('opciones-menu')
    if (await matchAutorPublicacion(id)) {
        await crearEliminar(id, opcionesContainer);
        await crearEditar(id, opcionesContainer);
    }
    opciones.appendChild(opcionesContainer);
}

const crearEliminar = async (id, div) => {
    const opcionesContainer = div
    const eliminarPost = document.createElement('button');
    eliminarPost.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar publicación.'
    eliminarPost.addEventListener('click', async () => {
        const req = await fetch(`home/eliminar-post`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postid": id
            })
        })
        const resultado = await req.json();
        if (resultado.success) document.getElementById(id).parentNode.removeChild(document.getElementById(id))
        else alert('No se pudo eliminar la publicación: ' + resultado.message)
    })
    opcionesContainer.appendChild(eliminarPost);
}

const crearEditar = async (id, div) => {
    const opcionesContainer = div
    const editarPost = document.createElement('button');
    editarPost.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar publicación.'
    editarPost.addEventListener('click', async () => {
        const editInput = crearEditInput(id);
        document.body.appendChild(editInput);
    })
    opcionesContainer.appendChild(editarPost);
}

const crearEditInput = (id) => {
    const container = document.createElement('div');
    const exit = document.createElement('div');
    const editBox = document.createElement('div');
    const newText = document.createElement('input');
    const update = document.createElement('input');

    container.classList.add('edit-post-container');
    editBox.classList.add('edit-post-box');
    newText.classList.add('edit-post-content');
    update.classList.add('edit-post-submit');
    exit.classList.add('edit-post-exit')

    exit.innerText = 'X';

    newText.placeholder = 'Ingresa el nuevo texto'

    update.type = 'submit';
    update.disabled = true;

    newText.addEventListener('input', ()=>{
        if(newText.value!==''){
            update.disabled = false;
        }else{
            update.disabled = true;
        }
    })

    update.addEventListener('click', async()=>{
        const req = await fetch(`home/editar-post`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postid": id,
                "content": newText.value
            })
        })
        const resultado = await req.json();
        if (resultado.success) {
            document.getElementById(id).children[3].innerText=resultado.success;
            container.innerHTML ='';
            container.style.display='none';
        }else alert('No se pudo eliminar la publicación: ' + resultado.message)
    })

    exit.addEventListener('click', ()=>{
        container.innerHTML ='';
        container.style.display='none';
    })

    editBox.append(newText, update);
    container.append(exit, editBox);
    return container

}