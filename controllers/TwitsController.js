const redis = require('redis')
const redisClient = redis.createClient()

const DEFUALT_ROOM_NAME = 'happytalk'

const {log} = console

module.exports = {
    getTwits: function(){
        return new Promise((resolve, reject) => {

            redisClient.keys('twits:*', (err, replies) => {
                log(replies)
                replies.forEach(replyId => {
                    let reply = redisClient.hgetall(replyId)
                    log(reply)
                })
                resolve(replies)
            })
        })
    },

    addTwit: function(data){
        return new Promise((resolve, reject) => {

            let isSuccess = redisClient.hset(`twits:${data.id}`, 'twit', data.twit, 'date', new Date().getTime())
            resolve(isSuccess)
        })
    },

    deleteTwit: function(item){
        return new Promise((resolve, reject) => {
            redisClient.srem('twits', item)
            resolve()
        })
    }
}