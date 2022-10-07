"use strict";

const PRIMERA_FECHA = new Date('2022-10-04T17:00:00.000+00:00');
//La fecha de la primera publicacion en la DB;

const publicaciones= document.querySelector(".publicaciones");
const cargarMas= document.querySelector(".cargar-mas");

const formatearFecha = (date)=>{
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}.`;
}

const createPublicationCode = (publicacion) =>{
    const user = publicacion.user;
    const content = publicacion.content;
    const fechaPublicacion = new Date(publicacion.date);
    const date = formatearFecha(fechaPublicacion);

    const container = document.createElement("DIV");
    const comentarios = document.createElement("DIV");
    const usuario = document.createElement("H3");
    const contenido = document.createElement("P");
    const fecha = document.createElement("P");
    const btnComentario = document.createElement("INPUT");
    const btnEnviar = document.createElement("INPUT");
    
    container.classList.add("publicacion-cargada");
    fecha.classList.add('publicacion-fecha');
    contenido.classList.add('publicacion-contenido')
    comentarios.classList.add("comentarios");
    btnComentario.classList.add("comentario");
    btnEnviar.classList.add("comentario-enviar");

    btnEnviar.type = "submit";
    btnComentario.setAttribute("placeholder", "Introduce tu comentario");
    
    usuario.textContent = user;
    contenido.textContent = content;
    fecha.textContent = date;

    comentarios.appendChild(btnComentario);
    comentarios.appendChild(btnEnviar);

    container.appendChild(usuario);
    container.appendChild(fecha);
    container.appendChild(contenido);
    container.appendChild(comentarios);

    return container;
}

const noMasPublicaciones = ()=>{
    const container = document.createElement("P");
    container.classList.add("no-mas-publicaciones");
    container.textContent = 'No hay más publicaciones para mostrar';
    return container;
}

/*
const cargarMasPublicacines= (entry)=>{
    if(entry[0].isIntersecting) cargarPublicaciones();
}

const observer = new IntersectionObserver(cargarMasPublicacines);
*/

const cargarPublicaciones= async fecha=>{
    //console.log(fecha);
    const request = await fetch(`${location}/publicaciones`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'lastPostDate':fecha
            })
        })
    const content = await request.json();
    //console.log(content, content.length);
    //console.log(content)
    //const contenido=arr.content;
    const documentFragment=document.createDocumentFragment();
    for(let i=content.length-1; i>=0;i--){
        //console.log(contenido[contador])
        const newPublication = createPublicationCode(content[i]);
        documentFragment.appendChild(newPublication)
        if(i==content.lenght-1) observer.observe(newPublication)
    }
    publicaciones.appendChild(documentFragment);
    //console.log('Fecha: ' + fecha);
    let newFecha = new Date(await fecha);
    //console.log('NewFecha: '+newFecha);
    newFecha.setHours(newFecha.getHours()-1)

    if(content.length) cargarMas.classList.remove('cargando-publicaciones');
    if(content.length==0){
        cargarMas.classList.add('cargando-publicaciones')
        //console.log(formatearFecha(newFecha));
        if(newFecha > PRIMERA_FECHA) {
            return cargarPublicaciones(newFecha);
        }else {
            cargarMas.classList.remove('cargando-publicaciones');
            const endOfFile = noMasPublicaciones();
            publicaciones.appendChild(endOfFile);
            return PRIMERA_FECHA;
        };
    }
    //console.log('NewFecha: '+newFecha);
    return newFecha;
    //Este setDate tiene que coincidir con el del postController
}

const ahora = new Date();
var ultimaFechaCargada;
cargarPublicaciones(ahora)
.then(res=>{
    ultimaFechaCargada = res;
});

cargarMas.addEventListener('click', ()=>{
    //console.log(ultimaFechaCargada);
    if(ultimaFechaCargada>PRIMERA_FECHA)
    cargarPublicaciones(ultimaFechaCargada)
    .then(res=>{
        ultimaFechaCargada = res;
    })
    
});