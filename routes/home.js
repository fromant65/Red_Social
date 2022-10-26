const express = require('express');
const router = express.Router();
const path = require('path');
const postController = require('../controllers/postController')

//Para poder pedir la ruta /home, tenemos que estar logeados (tiene que haber una sesión activa)
//Así que si estamos logeados, mostramos la página. 
//Si no, volvemos al login
router.get('/', (req,res)=>{
    let session=req.session;
    if(session.userid) res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
    else res.redirect('/login'); 
})

//Si pedimos la ruta getId, quiere decir que hemos solicitado la id del usuario. 
//Devolvemos la sesion para que el frontend se encargue de hacer un fetch con los datos de la publicación
router.get('/getUserId', (req,res)=>{
    let session = req.session;
    if(session.userid) res.json({session});
    else res.redirect('/login');
})

//Si hacemos un post request a /home/publicar, deberemos manejar la nueva publicación desde el controlador
router.post('/publicar', postController.handleNewPost);

//Si hacemos un post request a /home/publicaciones, 
//deberemos manejar el pedido para mostrar publicaciones desde el controlardor
router.post('/publicaciones', postController.showPosts)

//Si hacemos un post request a /home/
router.post('/postId', postController.getPostId);

router.post('/like', postController.handleLike);

router.post('/getlikes', postController.getLikes);

router.get('/getcomentarios/:postid', postController.getComentarios);

router.post('/comentar', postController.handleNewComment);

router.post('/match-autores', postController.matchAutores);

router.post('/match-autores-comentarios', postController.matchCommentAutores);

router.post('/eliminar-post', postController.deletePost);

router.post('/editar-post', postController.editPost);

router.post('/eliminar-comentario', postController.deleteComment);

router.post('/editar-comentario', postController.editComment )

module.exports = router;