const chatTab = document.querySelector(".chat-tab");
const page = document.querySelector(".page");

const getChats = async () => {
    const username = await getUserId();
    const req = await fetch(`/get-chats-from-user/${username}`);
    const res = await req.json(); //chats es un array de ids de chats
    const chats = res.chats;
    return chats;
}

const getFollowed = async () => {
    const username = await getUserId();
    const req = await fetch(`/get-followed/${username}`);
    const res = await req.json();
    const followed = res.followed;
    return followed;
}

const createChatsHTML = async (chats) => {
    //console.log(chats)
    const container = document.createElement('div');
    container.classList.add('chats-container')
    container.innerText = 'Chats';
    const chatParticipants = await getChatParticipants(chats);
    const documentFragment = document.createDocumentFragment();
    for (let participant in chatParticipants) {
        const chatDiv = document.createElement('div');
        chatDiv.innerHTML = `<i class="fa-solid fa-circle-small"></i>${chatParticipants[participant].username}`;
        chatDiv.id = chats[participant].chatid;
        chatDiv.addEventListener('click', abrirChat);
        documentFragment.appendChild(chatDiv);
    }
    container.appendChild(documentFragment);
    return container;
}

const getChatParticipants = async (chats) => {
    const chatsParticipants = [];
    const userid = await getUserId();
    for (let chat in chats) {
        //Chats es un array de chats de User. tienen _id y chatid. 
        //Nos interesa buscar chats con chatid
        const req = await fetch(`/get-chat-participants/${chats[chat].chatid}`)
        const res = await req.json();
        let participants = res.participants;
        participants = participants.filter(participant => participant !== userid)
        chatsParticipants.push(participants[0]);
    }
    return chatsParticipants;
    //Esta funcion solo permite chats de dos personas
    //Los chats grupales estarán almacenados en otro atributo de User
}

const abrirChat = async (e) => {
    const id = e.currentTarget.id;
    const userid = await getUserId();
    const req = await fetch(`/get-chat-by-id/${id}`);
    const res = await req.json();
    const chat = res.chat;
    const chatDiv = await createChatHTML(id);
    let otherParticipant = chat.participants.filter(participant => participant.username !== userid)
    chatDiv.children[0].innerText = otherParticipant[0].username
    //Asignamos al name container el nombre del otro participante del chat
    page.appendChild(chatDiv);
}

const createFollowedHTML = async (followed) => {
    //Esta funcion muestra las personas con las que no tenemos un chat activo.
    //Esto impide que se borren los chats, 
    //ya que de borrarlos unilateralmente se crearia un conflicto entre usuarios
    //donde uno tendria el chat y el otro no, aunque podemos simplemente vaciarlos.
    const container = document.createElement('div');
    container.innerText = 'Seguidos';
    container.classList.add('followed-container')
    const documentFragment = document.createDocumentFragment();
    const availableChats = await getChatParticipants(await getChats());
    for (let user in followed) {
        //Verificamos que el usuario seguido en esta iteración no esté en la lista de chats abiertos. 
        //Si lo esta, terminamos la iteracion y empezamos otra
        if (availableChats.filter(chat => followed[user].username == chat.username).length === 1) continue;
        const chatDiv = document.createElement('div');
        chatDiv.innerHTML =`<i class="fa-solid fa-circle-small"></i>${followed[user].username}`;
        chatDiv.id = followed[user].username;
        chatDiv.addEventListener('click', crearChat);
        documentFragment.appendChild(chatDiv);
    }
    container.appendChild(documentFragment);
    return container;
}

const crearChat = async (e) => {
    const targetUser = e.currentTarget.id
    const clientUser = await getUserId();
    const req = await fetch(`/create-chat`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "targetUser": targetUser,
            "clientUser": clientUser
        })
    })
    const res = await req.json();
    const chatid = res.id;
    page.appendChild(await createChatHTML(chatid))
}

const createChatHTML = async (chatid) => {
    const chatContainer = document.createElement('div');
    const nameContainer = document.createElement('div');
    const messagesContainer = document.createElement('div');
    const sendMessageContainer = document.createElement('div');
    const messageInput = document.createElement('input');
    const sendMessage = document.createElement('input')

    const messages = await getChatMessages(chatid);
    const documentFragment = document.createDocumentFragment();
    for (let message in messages) {
        const messageDiv = document.createElement('div');
        messageDiv.innerText = messages[message].content;
        messageDiv.setAttribute('author', messages[message].author);
        messageDiv.setAttribute('date', messages[message].date);
        documentFragment.appendChild(messageDiv);
    }

    chatContainer.classList.add('chat-container');
    nameContainer.classList.add('name-container');
    messagesContainer.classList.add('messages-container');
    sendMessageContainer.classList.add('send-message-container');
    messageInput.classList.add('message-input');
    sendMessage.classList.add('send-message');

    sendMessage.disabled = true;

    nameContainer.addEventListener('click', killChat)
    messageInput.addEventListener('input', () => {
        if (messageInput.value !== '') {
            sendMessage.disabled = false;
            sendMessage.classList.add('send-message-not-disabled');
        } else {
            sendMessage.disabled = true;
            sendMessage.classList.remove('send-message-not-disabled')
        }
    })

    messageInput.placeholder = 'Escribe un mensaje...';
    sendMessage.value = 'Enviar';
    sendMessage.type = 'submit';

    messagesContainer.appendChild(documentFragment)
    sendMessageContainer.appendChild(messageInput);
    sendMessageContainer.appendChild(sendMessage);
    chatContainer.appendChild(nameContainer);
    chatContainer.appendChild(messagesContainer);
    chatContainer.appendChild(sendMessageContainer);

    return chatContainer
}

const killChat = (e)=>{
    const chatDiv = e.currentTarget.parentElement;
    chatDiv.display='none';
    chatDiv.innerHTML = '';
}

const getChatMessages = async (id) => {
    const req = await fetch(`/get-chat-messages/${id}`);
    const res = await req.json();
    const messages = res.messages;
    return messages;
}


getChats()
    .then(async chats => {
        const chatsDiv = await createChatsHTML(chats)
        chatTab.appendChild(chatsDiv);
    })
getFollowed()
    .then(async followed => {
        const followedDiv = await createFollowedHTML(followed);
        chatTab.appendChild(followedDiv);
    })


