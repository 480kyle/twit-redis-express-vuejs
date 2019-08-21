const bluebird = require('bluebird')

const redis = require('redis')
bluebird.promisifyAll(redis)
const redisClient = redis.createClient()

const {log} = require('../consts/constants')

const twitController = function () {

    function getTwits () {
        return new Promise((resolve, reject) => {
            // redisClient.keysAsync('twits:*').then(replies => {
            //     resolve(replies)
            // }).catch(err => reject(err))

            redisClient.scanAsync(0, 'match', 'twits:*', 'count', 100).then(replies => {
                resolve(replies[1])
            }).catch(err => reject(err))
        })
    }

    function getTwit (id) {
        return new Promise((resolve, reject) => {
            redisClient.hgetallAsync(id).then((reply) => {
                reply['id'] = id
                resolve(reply)
            }).catch(err => reject(err))
        })
    }

    function addTwit (data) {
        return new Promise((resolve, reject) => {

            redisClient.hsetAsync(`twits:${data.id}`, 'userId', data.userId, 'twit', data.twit, 'date', new Date().getTime()).then(res => resolve(res)).catch(err => reject(err))
        })
    }

    function updateTwit (data) {
        return new Promise((resolve, reject) => {
            redisClient.hsetAsync(data.id, 'userId', data.userId, 'twit', data.twit, 'date', new Date().getTime()).then(res => resolve(data)).catch(err => reject(err))
        })
    }

    function deleteTwit (id) {
        return new Promise((resolve, reject) => {
            redisClient.delAsync(id).then(res => {
                resolve(id)
            }).catch(err => reject(err))
        })
    }

    return {
        getTwits: getTwits,
        getTwit: getTwit,
        addTwit: addTwit,
        updateTwit: updateTwit,
        deleteTwit: deleteTwit
    }
}()

module.exports = twitController