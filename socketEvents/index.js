const express = require('express')
const router = express.Router()

const {log} = console
const DEFUALT_ROOM_NAME = 'happytalk'

const twitController = require('../controllers/TwitController')

module.exports = function(io){
    log('socket on')

    io.on('connection', socket => {
        log('a user connected: ', DEFUALT_ROOM_NAME)

        socket.join(DEFUALT_ROOM_NAME)

        socket.emit('connect ok', {
            data: 'aaaaa'
        })

        socket.on('addTwit', data => {
            log(data.twit)

            let id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

            // redisClient.sadd("twits", JSON.stringify({id: id, twit: data.twit, date: new Date().getTime()}))
            // redisClient.hset(id, 'twit', data.twit, 'date', new Date().getTime())

            twitController.getTwits().then(res => {
                twitController.twitUpdate(io, socket, res)
            })
        })

        socket.on('getTwits', data => {
            twitController.getTwits().then(res => {
                twitController.twitUpdate(io, socket, res)
            })
        })

        socket.on('deleteItem', item => {
            log(item)
            // redisClient.srem('twits', item)
            twitController.getTwits().then(res => {
                twitController.twitUpdate(io, socket, res)
            })
        })
    })

    return router
}