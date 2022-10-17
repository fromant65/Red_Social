const searchUser = document.getElementById('search-user');
const searchResult = document.querySelector('.search-result');
searchResult.classList.add('search-result-invisible')

searchUser.addEventListener('input', async ()=>{
    const response = await fetch(`/search-user/${searchUser.value}`);
    const users = await response.json();
    if(users.length !== 0 || searchUser.value){
        searchResult.classList.add('search-result-visible')
        searchResult.classList.remove('search-result-invisible')
        generarListaUsuariosHtml(users);
    }else{
        searchResult.classList.remove('search-result-visible')
        searchResult.classList.add('search-result-invisible')
    }
})

const generarListaUsuariosHtml=(users)=>{
    searchResult.innerHTML='';
    const documentFragment = document.createDocumentFragment();
    for(user in users){
        const userDiv = generarDivUsuario(users[user])
        documentFragment.appendChild(userDiv);
    }
    searchResult.appendChild(documentFragment);
}

const generarDivUsuario = (user)=>{
    const username = user.username;
    const fullname = user.fullname;
    
    const usernameDiv = document.createElement('div');
    const usernameLink = document.createElement('a');
    
    usernameLink.innerText = fullname;
    usernameLink.href = `/profile?username=${username}`;

    usernameDiv.appendChild(usernameLink);
    return usernameDiv;
}