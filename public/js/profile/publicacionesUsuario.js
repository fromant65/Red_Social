const publicacionesUsuario = document.querySelector('.publicaciones-usuario');

const getPublicacionesUsuario = async ()=>{
    const searchParams = new URLSearchParams(document.location.search)
    const username = searchParams.get('username');
    const link = document.URL.split("?")[1]?.length?
        `/user-publicaciones/${username}`:
        `/user-publicaciones/${await getUserId()}`;
    const req = await fetch(link);
    const data = await req.json();
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