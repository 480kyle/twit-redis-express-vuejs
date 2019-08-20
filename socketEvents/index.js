const express = require('express')
const router = express.Router()

const {log} = console
const DEFUALT_ROOM_NAME = 'happytalk'

const twitController = require('../controllers/TwitsController')

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

            let twit = {
                id: id,
                userId: socket.id,
                twit: data.twit,
                date: new Date().getTime()
            }

            twitController.addTwit(twit).then(res => {
                twitController.getTwits().then(res => {
                    io.to(DEFUALT_ROOM_NAME).emit('twitUpdate', res)
                })
            })

        })

        socket.on('getTwits', data => {
            twitController.getTwits().then(res => {
                socket.emit('twitUpdate', res)
            })
        })

        socket.on('getTwit', data => {
            twitController.getTwit(data).then(res => {
                socket.emit('onGetTwit', res)
            })
        })

        socket.on('deleteItem', id => {
            twitController.deleteTwit(id).then(res => {
                io.to(DEFUALT_ROOM_NAME).emit('onDeleteTwit', res)
            })
        })
    })

    return router
}