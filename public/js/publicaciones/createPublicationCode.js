const formatearFecha = (date)=>{
    let year_ = date.getFullYear();
    //El +1 es porque getMonth retorna valores del 0 al 11
    let month_ = (date.getMonth()+1)<10?`0${date.getMonth()+1}`:`${date.getMonth()+1}`;
    let date_ = date.getDate()<10?`0${date.getDate()}`:`${date.getDate()}`;
    let hours_ = date.getHours()<10?`0${date.getHours()}`:`${date.getHours()}`;
    let minutes_ = date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`;
    return `${date_}/${month_}/${year_}, ${hours_}:${minutes_}.`;
}

const styleLikes = (publicacion, botonLike)=>{
    //Esta funcion se encarga de darle estilo a los likes de una publicación
    cargarLikes(publicacion).then(async likes =>{
        let userId = await getUserId();
        let heart = likes.filter(user => user==userId).length===0?'regular':'solid'
        botonLike.innerHTML = `<i class="fa-${heart} fa-heart"> </i><p class="cant-likes">${likes.length} </p><p>Like${likes.length==1?'':'s'}</p>`;
    });
}

const createPublicationCode = (publicacion) =>{
    //Esta funcion crea la estructura html de una publicación y la devuelve en un div container
    const user = publicacion.user;
    const content = publicacion.content;
    const fechaPublicacion = new Date(publicacion.date);
    const date = formatearFecha(fechaPublicacion);

    //Elementos HTML
    const container = document.createElement("DIV");
    const acciones = document.createElement("DIV");
    const usuario = document.createElement("H3");
    const contenido = document.createElement("P");
    const fecha = document.createElement("P");
    const botonLike = document.createElement("button");
    const botonComentario = document.createElement("button");
    const opciones = document.createElement('div');
    
    //Clases
    container.classList.add("publicacion-cargada");
    fecha.classList.add('publicacion-fecha');
    contenido.classList.add('publicacion-contenido')
    acciones.classList.add("publicacion-acciones");
    botonLike.classList.add("acciones-like");
    botonComentario.classList.add("acciones-comentario");
    opciones.classList.add('publicacion-opciones');

    //Estilos
    styleLikes(publicacion, botonLike)
    botonComentario.innerHTML = '<i class="fa-regular fa-comment"> </i><p>Comentar</p>';

    //Event listeners
    botonLike.addEventListener('click', async ()=>{
        await darLike(publicacion);
        styleLikes(publicacion, botonLike)   
    })

    botonComentario.addEventListener('click', ()=>{
        const comentarios = getComentarios(publicacion);
        getPostId(publicacion).then(id=>cargarComentarios(comentarios,id));
    })
    //Las funciones darLike y abrirComentarios estarán en publicacionAcciones.js
    
    opciones.addEventListener('click', ()=>{
        if(opciones.classList.contains('publicacion-opciones-abierto')){
            opciones.classList.remove('publicacion-opciones-abierto')
        }else{
            getPostId(publicacion).then(id=>{
                container.id = id;
                generarPublicacionOpciones(id, opciones);
            })
            opciones.classList.add('publicacion-opciones-abierto')
        }

    })

    //Contenido
    usuario.textContent = user;
    contenido.textContent = content;
    fecha.textContent = date;
    opciones.innerHTML = '<div><i class="fa-solid fa-ellipsis"></i></div>';

    //Añadir elementos a sus respectivos parents
    acciones.appendChild(botonLike);
    acciones.appendChild(botonComentario);

    container.appendChild(opciones)
    container.appendChild(usuario);
    container.appendChild(fecha);
    container.appendChild(contenido);
    container.appendChild(acciones);

    return container;
}