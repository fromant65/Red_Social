const getPostId = async (publicacion)=>{
    //Esta funcion obtiene la ID de una publicación dados sus datos
    const user= publicacion.user;
    const content= publicacion.content;
    const date= new Date(publicacion.date);
    //console.log(user, date, content);
    const req = await fetch(`home/postId`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "user": user,
            "date": date,
            "content": content
        })
    })
    const res = await req.json();
    postId = res.success._id;
    //console.log(data.success._id);
    return postId;
}
