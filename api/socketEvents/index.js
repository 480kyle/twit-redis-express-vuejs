const express = require('express')
const router = express.Router()

const {DEFUALT_ROOM_NAME, log} = require('../../consts/constants')

const twitController = require('../controllers/TwitsController')

const Twit = require('../models/Twit')

const socketEvents = function(io){
    log('socket on')

    io.on('connection', socket => {
        log('a user connected: ', DEFUALT_ROOM_NAME)

        socket.join(DEFUALT_ROOM_NAME)

        socket.emit('connect ok', {
            data: 'aaaaa'
        })

        socket.on('addTwit', data => {
            log(data.message)

            const twit = new Twit(socket.id, data.message)

            twitController.addTwit(twit).then(res => {
                io.to(DEFUALT_ROOM_NAME).emit('onAddTwit', res)
                // twitController.getTwits().then(res => {
                //     io.to(DEFUALT_ROOM_NAME).emit('twitUpdate', res)
                // }).catch(err => log(err))
            }).catch(err => log(err))

        })

        socket.on('getTwits', data => {
            twitController.getTwits().then(res => {
                socket.emit('onGetTwits', res)
            }).catch(err => log(err))
        })

        socket.on('getTwit', data => {
            twitController.getTwit(data).then(res => {
                socket.emit('onAddTwit', res)
            }).catch(err => log(err))
        })

        socket.on('updateTwit', data => {
            twitController.updateTwit(data).then(res => {
                socket.emit('onUpdateTwit', res)
            }).catch(err => log(err))
        })

        socket.on('deleteItem', id => {
            twitController.deleteTwit(id).then(res => {
                io.to(DEFUALT_ROOM_NAME).emit('onDeleteTwit', res)
            }).catch(err => log(err))
        })
    })

    return router
}

module.exports = socketEvents