const darLike = async (publicacion)=>{
    /*Procedimiento a seguir al dar un like
    Para que el like quede registrado, se agrega al Post un atributo que sea un array de usuarios
    (que son los que dieron like). 
    Por lo tanto, cuando un usuario presiona el boton de like, 
    se hace un fetch POST con la ID del usuario (la cual conseguimos con getUserId())
    Luego, en backend, se guarda en la publicacion un nuevo elemento en el array 
    (si es que no está guardado aun) con la id de este usuario. 
    Si el usuario ya estaba en el array, se lo saca del mismo.
    Por último, cada vez que se carga la publicación, se hace un fetch de este campo 
    y si el usuario está en el array se resalta el like (con un icon solid en lugar de regular)
    */
    const userId = await getUserId();
    const postId = await getPostId(publicacion);
    fetch(`${location}/like`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid": postId,
            "userid": userId.session.userid            
        })
    })
}

const cargarLikes = async (publicacion)=>{
    //Esta funcion obtiene la cantidad de likes de una publicación y la retorna
    const postId =  await getPostId(publicacion)
    const resLikes = await fetch(`${location}/getlikes`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "postid":postId
        })
    })
    const likes = await resLikes.json();
    return likes.likes;
}

