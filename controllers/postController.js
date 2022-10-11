const Post = require('../model/Post')

const handleNewPost = async (req, res) => {
    let session = req.session
    if (!session.userid) res.redirect('/login');
    user = req.body.user;
    content = req.body.content;
    date = req.body.date;
    try {
        const result = await Post.create({
            'user': user,
            'content': content,
            'date': date
        })
        res.status(201).json({ 'success': `${result}` });
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const showPosts = (req, res) => {
    let session = req.session
    if (!session.userid) res.redirect('/login');
    const lastDate = req.body.lastPostDate;
    const firstDate = new Date(lastDate);
    firstDate.setHours(firstDate.getHours() - 1);
    //La siguiente funcion busca los posts entre la primera y la ultima fecha indicadas
    //que por definicion de la función tienen 1 hora de diferencia.
    Post.find({ date: { "$gte": firstDate, "$lt": lastDate } }).lean().exec((err, posts) => {
        if (!posts) res.status(204);
        return res.status(200).json(posts);
    });
}

const getPostId = async (req, res) => {
    let session = req.session
    if (!session.userid) res.redirect('/login');
    user = req.body.user;
    content = req.body.content;
    date = req.body.date;
    try {
        const result = await Post.findOne({
            'user': user,
            'content': content,
            'date': date
        })
        res.status(201).json({ 'success': result });
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const handleLike = async (req, res) => {
    const userid = req.body.userid;
    const postid = req.body.postid;
    const post = await Post.findById(postid).exec();
    if (post == null) {
        res.status(500).json({ 'message': 'Post not found' })
    }
    if (!post.likes.filter(_userid => _userid == userid).length) {
        //Si el atributo likes no tiene dentro de sí el usuario que le dio like, debemos incluirlo
        const newLikes = post.likes;
        newLikes.push(userid);
        Post.findByIdAndUpdate(post, { likes: newLikes }, (error, result) => {
            if (error) {
                res.status(500).json({ 'message': error });
            } else {
                res.status(204).json({ 'success': result });
            }
        })
    } else {
        //Si el usuario está, debemos sacarlo
        const newLikes = post.likes.filter(_userid => _userid !== userid)
        Post.findByIdAndUpdate(post, { likes: newLikes }, (error, result) => {
            if (error) {
                res.status(500).json({ 'message': error });
            } else {
                res.status(204).json({ 'success': result });
            }
        })
    }
}

const getLikes = async (req, res) => {
    const postid = req.body.postid;
    try {
        const post = await Post.findById(postid).exec();
        const likes = post.likes;
        res.json({ likes });
    } catch (err) {
        res.status(500).json({ 'message': err })
    }

}

const getComentarios = async (req, res) => {
    const postid = req.body.postid;
    try {
        const post = await Post.findById(postid).exec();
        const comentarios = post.comments;
        res.json({ comentarios });
    } catch (err) {
        res.status(500).json({ 'message': err })
    }
}

const handleNewComment = async (req, res) => {
    let session = req.session
    if (!session.userid) res.redirect('/login');
    const user = req.body.user;
    const content = req.body.content;
    const date = req.body.date;
    const postid = req.body.postid;
    try {
        const post = await Post.findById(postid).exec();
        const newComments = post.comments;
        newComments.push({
            "user":user,
            "content":content,
            "date":date
        })
        Post.findByIdAndUpdate(post, {comments: newComments}, (error, result) => {
            if (error) {
                res.status(500).json({ 'message': error });
            } else {
                res.status(204).json({ 'success': result });
            }
        })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewPost, showPosts, getPostId, handleLike, getLikes, getComentarios, handleNewComment };