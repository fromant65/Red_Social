const verifySession = (req)=>{
    let session = req.session
    if (!session.userid) res.redirect('/login');
}

module.exports = {verifySession}