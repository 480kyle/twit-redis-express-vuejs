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

app.use(express.static(path.join(__dirname, 'static')))

app.set('view engine', 'ejs')

// Server Routers
app.get('/', (req, res)=>{
    res.render(path.join(__dirname, 'views/index.ejs'), {title: 'Mini real time twit main'})
})

// Socket Controllers
io.on('connection', socket => {
    log('a user connected')

    socket.emit('connect ok', {
        data: 'aaaaa'
    })
    // redisClient.get('name', (err, reply) => {
    //     socket.emit('user connect', reply)
    // })

    getAsync('name').then(reply => {
        socket.emit('user connect', reply)
    })


    socket.on('onTwitSubmit', data => {
        log(data.twit)

        redisClient.sadd("twits", JSON.stringify({twit: data.twit, date: new Date().getTime()}))

        twitController.getTwits().then(res => {
            socket.emit('twitUpdate', res)
        })
    })
})

const twitController = {
    getTwits: function(){
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
        //         return replies
        //         // console.log("MULTI got " + replies.length + " replies")
        //         // replies.forEach(function (reply, index) {
        //         //     console.log("Reply " + index + ": " + reply.toString())
        //         // })
        //     })

        return new Promise((resolve, reject) => {
            redisClient.multi()
                .scard("twits")
                .smembers("twits")
                .keys("twits", function (err, replies) {
                    // NOTE: code in this callback is NOT atomic
                    // this only happens after the the .exec call finishes.
                    redisClient.mget(replies, redis.print)
                })
                .dbsize()
                .exec(function (err, replies) {
                    resolve(replies)
                    // console.log("MULTI got " + replies.length + " replies")
                    // replies.forEach(function (reply, index) {
                    //     console.log("Reply " + index + ": " + reply.toString())
                    // })
                })
        })
    }
}

http.listen(3000, () => {
    log('listening on *:3000')
})