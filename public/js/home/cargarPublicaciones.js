"use strict";

//La fecha de la primera publicacion en la DB;
const PRIMERA_FECHA = new Date('2022-10-04T17:00:00.000+00:00');

//Div donde se mostrarán las publicaciones
const publicaciones= document.querySelector(".publicaciones");
//Boton para cargar publicaciones más antiguas
const cargarMas= document.querySelector(".cargar-mas");
//Rueda de carga - Hidden por default
const cargando = document.querySelector(".cargando-hidden");

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

const noMasPublicaciones = ()=>{
    //Esta funcion crea un mensaje cuando no hay mas publicaciones para cargar en la DB
    const container = document.createElement("P");
    container.classList.add("no-mas-publicaciones");
    container.textContent = 'No hay más publicaciones para mostrar';
    cargarMas.style.display = 'none';
    cargarMas.style.position = 'absolute';
    return container;
}

/*
const cargarMasPublicacines= (entry)=>{
    if(entry[0].isIntersecting) cargarPublicaciones();
}

const observer = new IntersectionObserver(cargarMasPublicacines);
*/

const fetchPublicaciones = async (fecha)=>{
    //Esta funcion hace un fetch de publicaciones dada una determinada fecha (objeto Date)
    const date = await fecha;
    const request = await fetch(`${location}/publicaciones`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'lastPostDate':date
            })
        })
    const content = await request.json();
    return content;
}

const mostrarRuedaCarga= ()=>{
    cargando.classList.add('cargando-visible');
    cargando.classList.remove('cargando-hidden');
}

const ocultarRuedaCarga = ()=>{
    cargando.classList.add('cargando-hidden');
    cargando.classList.remove('cargando-visible');
}

const crearPublicaciones = content =>{
    const documentFragment=document.createDocumentFragment();
    for(let i=content.length-1; i>=0;i--){
        const newPublication = createPublicationCode(content[i]);
        documentFragment.appendChild(newPublication)
        //if(i==content.lenght-1) observer.observe(newPublication)
    }
    publicaciones.appendChild(documentFragment);
}

/*
Para que el setHours no tenga que coincidir con el del Postcontroller
lo que se puede hacer es incluir la cantidad de horas directamente 
en el fetch de cargarPublicaciones (y en la llamada a la funcion)
*/
const cargarPublicaciones= async fecha=>{
    const content = await fetchPublicaciones(fecha);
    let newFecha = new Date(await fecha);
    //Seteamos la nueva fecha a una hora antes para que busque publicaciones más antiguas
    //Este setHours tiene que coincidir con el del postController en el backend
    newFecha.setHours(newFecha.getHours()-1);
    
    //Si el fetch no encontró publicaciones y llegamos a PRIMERA_FECHA
    //entonces no hay más publicaciones
    if(!content.length && newFecha <= PRIMERA_FECHA){
        ocultarRuedaCarga()
        const endOfFile = noMasPublicaciones();
        publicaciones.appendChild(endOfFile);
        return PRIMERA_FECHA;
    }
    if(!content.length){
        //Si el fetch no encontró resultados pero no estamos en la primera fecha, seguimos buscando
        mostrarRuedaCarga();
        return cargarPublicaciones(newFecha);
    }else{
        //Si el fetch encontró resultados, los mostramos y no cargamos más publicaciones
        ocultarRuedaCarga();
        crearPublicaciones(content);
        return newFecha;
    }    
}

const ahora = new Date();
var ultimaFechaCargada;
cargarPublicaciones(ahora)
.then(res=>{
    ultimaFechaCargada = res;
});

cargarMas.addEventListener('click', ()=>{
    if(ultimaFechaCargada>PRIMERA_FECHA)
    cargarPublicaciones(ultimaFechaCargada)
    .then(res=>{
        ultimaFechaCargada = res;
    })
});