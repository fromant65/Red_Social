const comentarios = document.querySelector(".comentarios");

const getComentarios = async (publicacion)=>{
    /*Procedimiento para cargar comentarios
    Debido a que los comentarios están dentro de la data de la publicación,
    debemos hacer un fetch con la id de la publicación 
    y mostrar una ventana sobre la página con los comentarios.
    El fetch nos devuelve la lista de comentarios y los creamos como una publicación
     */
    const postId = await getPostId(publicacion);
    const resComentarios = await fetch(`${location}/getcomentarios`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid":postId
        })
    })
    const comentarios = await resComentarios.json();
    return comentarios;
}

const killComments = ()=>{
    comentarios.innerHTML = "";
    comentarios.classList.remove('comentarios-visibles');
};

const cargarComentarios = async (_comentarios, postId)=>{
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
    const user = comentario.user?comentario.user:'undefined';
    const content = comentario.content;
    const date = new Date(comentario.date);
    
    const container = document.createElement('div');
    const userDiv = document.createElement('div');
    const contentDiv = document.createElement('div');
    const dateDiv = document.createElement('div');

    container.classList.add('comment-container')
    userDiv.classList.add('comment-user')
    contentDiv.classList.add('comment-content')
    dateDiv.classList.add('comment-date')

    userDiv.innerText = user;
    contentDiv.innerText = content;
    dateDiv.innerText = formatearFecha(date);

    userDiv.style.display = "inline";
    dateDiv.style.display = "inline";

    container.appendChild(userDiv);
    container.appendChild(dateDiv);
    container.appendChild(contentDiv);

    return container;
}

const realizarComentario = async (e)=>{
    e.preventDefault();
    const input = document.querySelector('.input-comment');
    const content = input.value;
    const session = await getUserId();
    const user = session.session.userid;
    const date = new Date();
    const postId = input.getAttribute('postId');
    fetch(`${location}/comentar`, {
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
    const newComment = crearComentario({
        "user":user,
        "content":content,
        "date":date
    })
    const container = document.querySelector('.comments-container');
    input.value = "";
    container.appendChild(newComment);
}