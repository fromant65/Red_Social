const publicacionesUsuario = document.querySelector('.publicaciones-usuario');

const getPublicacionesUsuario = async ()=>{
    const res = await fetch('/user-publicaciones');
    const data = await res.json();
    return data;
}

const generarHtmlPublicacionesUsuario = async (data) =>{
    const content = await data;
    const documentFragment=document.createDocumentFragment();
    for(let i=content.length-1; i>=0;i--){
        const newPublication = createPublicationCode(content[i]);
        documentFragment.appendChild(newPublication)
        //if(i==content.lenght-1) observer.observe(newPublication)
    }
    publicacionesUsuario.appendChild(documentFragment);
}

generarHtmlPublicacionesUsuario(getPublicacionesUsuario());