"use strict";

//La fecha de la primera publicacion en la DB;
const PRIMERA_FECHA = new Date('2022-10-04T17:00:00.000+00:00');

//Div donde se mostrarán las publicaciones
const publicaciones= document.querySelector(".publicaciones");
//Boton para cargar publicaciones más antiguas
const cargarMas= document.querySelector(".cargar-mas");
//Rueda de carga - Hidden por default
const cargando = document.querySelector(".cargando-hidden");



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
    const userid = await getUserId();
    const request = await fetch(`home/publicaciones`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'lastPostDate':date,
                'userid': userid
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