"use strict";

const publicaciones= document.querySelector(".publicaciones");
const cargarMas= document.querySelector(".cargar-mas");

const createPublicationCode = (publicacion) =>{
    const user = publicacion.user;
    const content = publicacion.content;
    const date = publicacion.date;

    const container = document.createElement("DIV");
    const comentarios = document.createElement("DIV");
    const usuario = document.createElement("H3");
    const contenido = document.createElement("P");
    const fecha = document.createElement("P");
    const btnComentario = document.createElement("INPUT");
    const btnEnviar = document.createElement("INPUT");
    
    container.classList.add("publicacion");
    comentarios.classList.add("comentarios");
    btnComentario.classList.add("comentario");
    btnEnviar.classList.add("enviar");

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
    //console.log(content)
    //const contenido=arr.content;
    const documentFragment=document.createDocumentFragment();
    for(let i=0; i<content.length;i++){
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
    cargarPublicaciones(ultimaFechaCargada)
    .then(res=>{
        ultimaFechaCargada = res;
    })
});