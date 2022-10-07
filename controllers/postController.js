const Post = require('../model/Post')

const handleNewPost = async (req,res)=>{
    user = req.body.user;
    content = req.body.content;
    date = req.body.date;
    try{
        const result = await Post.create({
            'user': user, 
            'content': content,
            'date': date
        })
        res.status(201).json({'success': `${result}`});
    }catch(err){
        res.status(500).json({'message':err.message})
    }
}

const showPosts = (req,res)=>{
    const lastDate = req.body.lastPostDate;
    const firstDate = new Date(lastDate);
    firstDate.setHours(firstDate.getHours()-1);
    //La siguiente funcion busca los posts entre la primera y la ultima fecha indicadas
    //que por definicion de la función tienen 1 hora de diferencia.
    Post.find({date:{"$gte": firstDate, "$lt": lastDate}}).lean().exec( (err, posts) =>{
        if(!posts) res.status(204);
        return res.status(200).json(posts);
    });
}

module.exports = {handleNewPost, showPosts};