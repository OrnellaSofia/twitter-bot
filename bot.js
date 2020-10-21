const config = require('./config')
const twit = require('twit')
const T = new twit(config)  // cambiar a config.js en entorno local
const sequelize = require('./tweets-db')


async function postTweet(){
    let tweetId = await sequelize.query('SELECT id FROM tweets ORDER BY id ASC LIMIT 1', {type: sequelize.QueryTypes.SELECT})
    tweetId = tweetId[0].id
    const data = await sequelize.query('SELECT * FROM tweets WHERE id = ?', 
    {replacements: [tweetId], type: sequelize.QueryTypes.SELECT})
    if(data.length){
        const contenidoTweet = "Hoy no pueden comprar dólares " + data[0].contenido
        T.post('statuses/update', {status: contenidoTweet}, function(err, data, response) {console.log("Tweeted!")})
    }else{
        console.log("Id no encontrado")
    }
    deleteTweetInfo(tweetId)
}

function deleteTweetInfo(tweetId){
    sequelize.query('DELETE FROM `tweets` WHERE id = ?', {replacements: [tweetId]})
    .then(() => console.logs("TweetInfo deleted."))
    .catch(() => console.log("Error en el borrado."))
}

postTweet()
setInterval(postTweet, 1000*60*60*12)
