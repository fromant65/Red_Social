const comentarios = document.querySelector(".comentarios");

const getComentarios = async (publicacion)=>{
    /*Procedimiento para cargar comentarios
    Debido a que los comentarios están dentro de la data de la publicación en la DB,
    debemos hacer un fetch con la id de la publicación 
    y mostrar una ventana sobre la página con los comentarios.
    El fetch nos devuelve la lista de comentarios y los creamos como una publicación
     */
    const postId = await getPostId(publicacion);
    const reqComentarios = await fetch(`home/getcomentarios/${postId}`)
    window.history.pushState("","",`${document.URL.split("?")[0]}`);
    window.history.pushState("","",`${location}?id=${postId}`);
    const comentarios = await reqComentarios.json();
    return comentarios;
}

const killComments = ()=>{
    comentarios.innerHTML = "";
    window.history.pushState("","",`${document.URL.split("?")[0]}`);
    comentarios.classList.remove('comentarios-visibles');
};

const cargarComentarios = async (_comentarios, postId)=>{
    //Esta funcion crea el codigo HTML para la sección de comentarios
    const objComentarios = await _comentarios;
    const arrayComentarios = objComentarios.comentarios;
    const documentFragment = document.createDocumentFragment();
    const divGeneral = document.createElement('div');
    divGeneral.classList.add('comentarios-div-general')
    const divCerrar = document.createElement('div');
    divCerrar.classList.add('cerrar-comentarios-container');
    const botonCerrar = document.createElement('button');

    botonCerrar.innerHTML= '<i class="fa-solid fa-xmark">';
    botonCerrar.addEventListener('click', killComments);

    divCerrar.appendChild(botonCerrar)

    divGeneral.appendChild(divCerrar)

    const commentContainer = document.createElement('div')
    commentContainer.classList.add('comments-container');
    for(let i=0; i<arrayComentarios.length; i++){
        const comentario = crearComentario(arrayComentarios[i]);
        comentario.id = arrayComentarios[i]._id;
        //console.log(comentario.id);
        commentContainer.appendChild(comentario)
    }
    divGeneral.appendChild(commentContainer);

    const formComentar = document.createElement('form');
    formComentar.action = "/comentar";
    formComentar.method = "post";
    const inputComment = document.createElement('input');
    inputComment.classList.add('input-comment')
    inputComment.setAttribute('postId', postId);
    inputComment.placeholder = "Escribe un comentario...";
    const sendComment = document.createElement('input');
    sendComment.classList.add('send-comment');
    sendComment.type = "submit";
    sendComment.addEventListener('click', realizarComentario)

    formComentar.appendChild(inputComment);
    formComentar.appendChild(sendComment);
    divGeneral.appendChild(formComentar);

    documentFragment.appendChild(divGeneral)
    comentarios.appendChild(documentFragment);
    comentarios.classList.add('comentarios-visibles');
}

const crearComentario =  (comentario)=>{
    //Esta funcion crea el HTML para un comentario específico
    const user = comentario.user?comentario.user:'undefined';
    const content = comentario.content;
    const date = new Date(comentario.date);
    const commentId = comentario._id;
    
    const container = document.createElement('div');
    const userDiv = document.createElement('div');
    const opcionesButton = document.createElement('button')
    const contentDiv = document.createElement('div');
    const dateDiv = document.createElement('div');

    container.classList.add('comment-container');
    userDiv.classList.add('comment-user');
    opcionesButton.classList.add('comment-opciones');
    contentDiv.classList.add('comment-content');
    dateDiv.classList.add('comment-date');

    userDiv.innerText = user;
    contentDiv.innerText = content;
    dateDiv.innerText = formatearFecha(date);
    opcionesButton.innerHTML = '<div><i class="fa-solid fa-ellipsis"></i></div>';

    userDiv.style.display = "inline";
    dateDiv.style.display = "inline";

    opcionesButton.addEventListener('click', (e)=>{
        if(opcionesButton.classList.contains('comment-opciones-abierto')){
            opcionesButton.classList.remove('comment-opciones-abierto')
        }else{
            const searchParams = new URLSearchParams(document.location.search)
            const postId = searchParams.get('id');
            generarComentarioOpciones(postId, commentId, opcionesButton);
            opcionesButton.classList.add('comment-opciones-abierto')
        }
    })

    container.appendChild(userDiv);
    container.appendChild(dateDiv);
    container.appendChild(opcionesButton);
    container.appendChild(contentDiv);

    return container;
}

const matchAutorComentario = async(postid, commentid)=>{
    //Esta funcion determina si el que intenta abrir las opciones de la publicación y su autor
    //son la misma persona
    const userid = await getUserId();
    const req = await fetch(`home/match-autores-comentarios`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid":postid,
            "commentid": commentid,
            "userid":userid
        })
    })
    const data = await req.json();
    return data.match //El fetch devuelve un json que tiene un atributo match que es true o false
}

const generarComentarioOpciones = async(postid, commentid, div)=>{
    //Esta funcion genera el menu de opciones de un comentario
    const opciones = div;
    const opcionesContainer = document.createElement('div');
    opcionesContainer.classList.add('opciones-menu')
    if(await matchAutorComentario(postid, commentid)) {
        await crearEliminarComentario(postid, commentid, opcionesContainer);
        await crearEditarComentario(postid, commentid, opcionesContainer);
    }
    opciones.appendChild(opcionesContainer);
}

const crearEliminarComentario = async(postid, commentid, container)=>{
    const opcionesContainer = container;
    const eliminarComentario = document.createElement('button');
    eliminarComentario.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar comentario.'
    eliminarComentario.addEventListener('click', async ()=>{
        const req = await fetch(`home/eliminar-comentario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postid":postid,
                "commentid": commentid
            })
        })
        const resultado = await req.json();
        //Si se pudo eliminar, eliminamos el html del comentario
        if(resultado.success) document.getElementById(`${commentid}`).parentNode.removeChild(document.getElementById(`${commentid}`));
        else alert('No se pudo eliminar el comentario: '+ resultado.message)
    })
    opcionesContainer.appendChild(eliminarComentario);
}

const crearEditarComentario = async (postid, commentid, container)=>{
    const opcionesContainer = container;
    const editarComment = document.createElement('button');
    editarComment.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar comentario.'
    editarComment.addEventListener('click', async () => {
        const editInput = await crearEditCommentInput(postid, commentid);
        document.body.appendChild(editInput);
    })
    opcionesContainer.appendChild(editarComment);
}

const crearEditCommentInput = async (postid, commentid)=>{
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
        const req = await fetch(`home/editar-comentario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postid": postid,
                "commentid": commentid,
                "content": newText.value
            })
        })
        const resultado = await req.json();
        if (resultado.success) {
            document.getElementById(commentid).children[3].innerText=resultado.success;
            container.innerHTML ='';
            container.style.display='none';
        }else alert('No se pudo eliminar el comentario: ' + resultado.message)
    })

    exit.addEventListener('click', ()=>{
        container.innerHTML ='';
        container.style.display='none';
    })

    editBox.append(newText, update);
    container.append(exit, editBox);
    return container
}

const realizarComentario = async (e)=>{
    //Esta funcion se encarga de postear un comentario
    e.preventDefault();
    const input = document.querySelector('.input-comment');
    const content = input.value;
    const user = await getUserId();
    const date = new Date();
    const postId = input.getAttribute('postId');
    const req = await fetch(`home/comentar`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid":postId,
            "user":user,
            "content":content,
            "date":date
        })
    })
    const res = await req.json();
    const comment = res.comment;
    const newComment = crearComentario({
        "user":comment.user,
        "content":comment.content,
        "date":comment.date,
        "_id": comment._id
    })
    const container = document.querySelector('.comments-container');
    input.value = "";
    container.appendChild(newComment);
}