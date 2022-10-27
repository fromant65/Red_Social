# Red_Social
## Este proyecto es una interfaz de una red social 
Las herramientas utilizadas para crearlo fueron Javascript, Node.JS, Express, MongoDB (y un poco de Bootstrap)
## Features
### Creación de usuarios y Log in
En la página principal se puede ir a una página que nos permite logearnos y a otra que nos permite registrarnos en caso de que no tengamos una cuenta.
### Postear publicaciones
Cuando nos logeamos, tenemos la posibilidad de crear publicaciones y postearlas. Sin embargo, solo se permite texto.
### Comentarios
Podemos hacer comentarios en publicaciones
### Borrar y editar publicaciones y comentarios
Se pueden borrar y editar las publicaciones y comentarios que hemos hecho.
### Lazy load de publicaciones
Existe un boton que nos permite cargar publicaciones. La carga se realiza de a rangos horarios (se cargan todas las publicaciones publicadas en el rango de una hora) por lo que cargar publicaciones antiguas puede llevar bastante tiempo.
### Perfil
Podemos ver nuestro perfil donde habrá cierta información de nuestro usuario y la lista de nuestros posts
### Buscar usuarios
Podemos buscar usuarios y ver sus perfiles
### Seguir usuarios
Al entrar al perfil de otro usuario podemos seguirlo y además ver su cantidad de seguidores y seguidos (en nuestro propio perfil tambien). Una vez que los sigamos, sus publicaciones nos apareceran en la página principal.
### Configuraciones
Podemos cambiar los datos de nuestro perfil y tambien nuestro usuario en configuraciones
### Chat
Podemos empezar chats con otros usuarios si los seguimos, o abrir chats ya empezados. Cabe aclarar que cuando un mensaje entra, el chat no se actualiza automáticamente por lo que debe ser cerrado y volver a abrirse para actualizar los mensajes. El chat es accesible solo desde la página principal.