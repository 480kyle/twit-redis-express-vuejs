const bluebird = require('bluebird')

const redis = require('redis')
bluebird.promisifyAll(redis)
const redisClient = redis.createClient()

const DEFUALT_ROOM_NAME = 'happytalk'

const {log} = console

module.exports = {
    getTwits: function(){
        return new Promise((resolve, reject) => {
            redisClient.keysAsync('twits:*').then(replies => {
                resolve(replies)
            })
        })
    },

    getTwit: function(id){
        return new Promise((resolve, reject) => {
            redisClient.hgetallAsync(id).then((reply) => {
                reply['id'] = id
                resolve(reply)
            })
        })
    },

    addTwit: function(data){
        return new Promise((resolve, reject) => {

            let isSuccess = redisClient.hset(`twits:${data.id}`, 'twit', data.twit, 'date', new Date().getTime())
            resolve(isSuccess)
        })
    },

    deleteTwit: function(id){
        return new Promise((resolve, reject) => {
            redisClient.del(id, (err, reply) => {
                resolve(id)
            })
        })
    }
}