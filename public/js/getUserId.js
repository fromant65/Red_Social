const getUserId = async ()=>{
    //Obtenemos la data de la sesión 
    //(donde se encuentra el id de usuario con el que identificaremos quién hizo la publicación)
    const request = await fetch(`/home/getUserId`);
    const data = await request.json();
    return data.session.userid;
}