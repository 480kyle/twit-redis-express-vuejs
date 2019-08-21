const bluebird = require('bluebird')

const redis = require('redis')
bluebird.promisifyAll(redis)
const redisClient = redis.createClient()

const {log} = require('../consts/constants')

const twitController = function () {

    function getTwits () {
        return new Promise((resolve, reject) => {
            redisClient.keysAsync('twits:*').then(replies => {
                resolve(replies)
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

            let isSuccess = redisClient.hsetAsync(`twits:${data.id}`, 'userId', data.userId, 'twit', data.twit, 'date', new Date().getTime()).then(res => resolve(isSuccess)).catch(err => reject(err))
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
        deleteTwit: deleteTwit
    }
}()

module.exports = twitController