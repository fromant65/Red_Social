const infoUsuarioContainer = document.querySelector('.info-usuario');

const cargarInfoUsuario = async()=>{
    const searchParams = new URLSearchParams(document.location.search)
    const username = searchParams.get('username');
    const link = document.URL.split("?")[1]?.length?
        `/user-info/${username}`:
        `/user-info/${await getUserId()}`;
    const req = await fetch(link);
    const data = await req.json()
    return data.user;
}

const generarHtmlInfoUsuario = async (data)=>{
    const _data = await data;
    //console.log(_data.roles, _data.username,  _data);
    const username = _data.username;
    const email = _data.email;
    const fullname = _data.fullname;
    //const roles = _data.roles;

    const userDiv = document.createElement('div');
    //const rolesDiv = document.createElement('div');
    const emailDiv  = document.createElement('div');
    const fullnameDiv = document.createElement('div');
    
    userDiv.id = 'username-div';
    emailDiv.id = 'email-div';
    fullnameDiv.id = 'fullname-div';

    userDiv.innerHTML = `<a href="/profile?username=${username}">@${username}</a>`;
    emailDiv.innerHTML = `<p>Email:</p><p id="email">${email}</p>`;
    fullnameDiv.innerText = fullname;
    /*rolesDiv.innerText = 'Roles: \n';
    Object.entries(roles).map(rol=>{rolesDiv.innerText += `\t${rol[0]}\n`;})*/

    infoUsuarioContainer.appendChild(fullnameDiv);
    infoUsuarioContainer.appendChild(userDiv);
    //infoUsuarioContainer.appendChild(rolesDiv);
    infoUsuarioContainer.appendChild(emailDiv);
}

generarHtmlInfoUsuario(cargarInfoUsuario())