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

//Si pedimos la ruta publicar, quiere decir que hemos hecho una publicación. 
//Devolvemos la sesion para que el frontend se encargue de hacer un fetch con los datos de la publicación
router.get('/publicar', (req,res)=>{
    let session = req.session;
    if(session.userid) res.json({session});
    else res.redirect('/login');
})

//Si hacemos un post request a /home/publicar, deberemos manejar la nueva publicación desde el controlador
router.post('/publicar', postController.handleNewPost);

//Si hacemos un post request a /home/publicaciones, 
//deberemos manejar el pedido para mostrar publicaciones desde el controlardor
router.post('/publicaciones', postController.showPosts)

module.exports = router;