const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const redis = require('redis')
const redisClient = redis.createClient()

const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);

const {log} = console

const DEFUALT_ROOM_NAME = 'happytalk'

app.use(express.static(path.join(__dirname, 'static')))

app.set('view engine', 'ejs')

// Server Routers
app.get('/', (req, res)=>{
    res.render(path.join(__dirname, 'views/index.ejs'), {title: 'Mini real time twit main'})
})


http.listen(3000, () => {
    log('listening on *:3000')
})

// Socket Controllers
io.on('connection', socket => {
    log('a user connected: ', DEFUALT_ROOM_NAME)

    socket.join(DEFUALT_ROOM_NAME)

    socket.emit('connect ok', {
        data: 'aaaaa'
    })
    redisClient.get('name', (err, reply) => {
        socket.emit('user connect', reply)
    })

    socket.on('addTwit', data => {
        log(data.twit)

        let id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

        redisClient.sadd("twits", JSON.stringify({id: id, twit: data.twit, date: new Date().getTime()}))

        twitController.getTwits().then(res => {
            twitController.twitUpdate(socket, res)
        })
    })

    socket.on('getTwits', data => {
        twitController.getTwits().then(res => {
            twitController.twitUpdate(socket, res)
        })
    })

    socket.on('deleteItem', item => {
        log(item)
        redisClient.srem('twits', item)
        twitController.getTwits().then(res => {
            twitController.twitUpdate(socket, res)
        })
    })
})

/* twit controller */
const twitController = {
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

            redisClient.multi().smembers("twits").exec(function (err, replies) {
                    resolve(replies)
                })
        })
    },

    twitUpdate: function(socket, res){
        io.to(DEFUALT_ROOM_NAME).emit('twitUpdate', res)
    }
}
