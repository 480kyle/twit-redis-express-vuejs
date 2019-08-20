const redis = require('redis')
const redisClient = redis.createClient()

const DEFUALT_ROOM_NAME = 'happytalk'

module.exports = {
    getTwits: function(){
        return new Promise((resolve, reject) => {
            // redisClient.multi()
            //     .scard("twits")
            //     .smembers("twits")
            //     .keys("twits", function (err, replies) {
            //         // NOTE: code in this callback is NOT atomic
            //         // this only happens after the the .exec call finishes.
            //         redisClient.mget(replies, redis.print)
            //     })
            //     .dbsize()
            //     .exec(function (err, replies) {
            //         resolve(replies)
            //         console.log("MULTI got " + replies.length + " replies")
            //         replies.forEach(function (reply, index) {
            //             console.log("Reply " + index + ": " + reply.toString())
            //         })
            //     })

            // redisClient.multi().smembers("twits").exec(function (err, replies) {
            //         resolve(replies)
            //     })

            redisClient.smembers('twits', (err, replies) => {
                resolve(replies)
            })
        })
    },

    twitUpdate: function(io, socket, res){
        io.to(DEFUALT_ROOM_NAME).emit('twitUpdate', res)
    }
}