const Post = require('../model/Post')

const handleNewPost = async (req,res)=>{
    user = req.body.user;
    content = req.body.content;
    date = req.body.date;
    //console.log({user, content});
    try{ 
        //create and store the new user
        const result = await Post.create({
            'user': user, 
            'content': content,
            'date': date
        })
        //console.log(result);
        res.status(201).json({'success': `${result}`});
    }catch(err){
        res.status(500).json({'message':err.message})
    }
}

const showPosts = (req,res)=>{
    //console.log(req.body);
    const lastDate = req.body.lastPostDate;
    let firstDate = new Date(lastDate);
    firstDate.setHours(firstDate.getHours()-1);
    //console.log(lastDate)
    //console.log(`First: ${firstDate}`)
    
    // El filtro {"$gt": firstDate, "$lt": lastDate} no funciona
    Post.find({"$gt": firstDate, "$lt": lastDate}).lean().exec( (err, posts) =>{
        if(!posts) res.status(204);
        return res.status(200).json(posts);
    });
}

module.exports = {handleNewPost, showPosts};