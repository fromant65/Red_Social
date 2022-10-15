const infoUsuarioContainer = document.querySelector('.info-usuario');

const cargarInfoUsuario = async()=>{
    const res = await fetch('/user-info');
    const data = await res.json()
    return data.user;
}

const generarHtmlInfoUsuario = async (data)=>{
    const _data = await data;
    //console.log(_data.roles, _data.username,  _data);
    const username = _data.username;
    const email = _data.email;
    const fullname = _data.fullname;
    const roles = _data.roles;

    const userDiv = document.createElement('div');
    const rolesDiv = document.createElement('div');
    const emailDiv  = document.createElement('div');
    const fullnameDiv = document.createElement('div');
    
    userDiv.innerText = `Username: ${username}`;
    emailDiv.innerText = `Email: ${email}`;
    fullnameDiv.innerText = `Nombre completo: ${fullname}`;
    rolesDiv.innerText = 'Roles: \n';
    Object.entries(roles).map(rol=>{rolesDiv.innerText += `\t${rol[0]}\n`;})

    infoUsuarioContainer.appendChild(userDiv);
    infoUsuarioContainer.appendChild(rolesDiv);
    infoUsuarioContainer.appendChild(emailDiv);
    infoUsuarioContainer.appendChild(fullnameDiv);
}

generarHtmlInfoUsuario(cargarInfoUsuario())