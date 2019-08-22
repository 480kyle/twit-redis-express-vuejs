const bluebird = require('bluebird')
const _ = require('lodash')

const redis = require('redis')
bluebird.promisifyAll(redis)
const redisClient = redis.createClient()

const Mysql = require('../services/Mysql')

const {log} = require('../../consts/constants')


// reset all data
redisClient.scanAsync(0, 'match', 'twits:*', 'count', 100)
    .then(replies => {
        redisClient.delAsync(id)
    })

const twitController = function () {

    function getTwits() {
        return new Promise((resolve, reject) => {
            redisClient.scanAsync(0, 'match', 'twits:*', 'count', 100)
                .then(replies => {

                    let twitsAsync = []

                    replies[1].forEach(item => {
                        twitsAsync.push(redisClient.hgetallAsync(item))
                    })
                    Promise.all(twitsAsync)
                        .then(res => {
                            resolve(_.orderBy(res, ['date'], ['desc']))
                        })
                })
                .catch(err => reject(err))
        })
    }

    function getTwit(id) {
        return new Promise((resolve, reject) => {
            redisClient.hgetallAsync(id)
                .then((reply) => {
                    resolve(reply)
                })
                .catch(err => reject(err))
        })
    }

    function addTwit(data) {
        return new Promise((resolve, reject) => {

            log('onAddTwit: ', data)

            redisClient.hsetAsync(data.id, 'id', data.id, 'userId', data.userId, 'message', data.message, 'date', data.date)
                .then(res => resolve(data))
                .catch(err => reject(err))
        })
    }

    function updateTwit(data) {
        return new Promise((resolve, reject) => {
            log('onUpdateTwit: ', data)
            redisClient.hsetAsync(data.id, 'userId', data.userId, 'message', data.message, 'date', Date.now())
                .then(res => resolve(data))
                .catch(err => reject(err))
        })
    }

    function deleteTwit(id) {
        return new Promise((resolve, reject) => {
            redisClient.delAsync(id)
                .then(res => {
                    resolve(id)
                })
                .catch(err => reject(err))
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