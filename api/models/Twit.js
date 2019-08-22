class Twit{

    constructor(userId, message){
        this.id = `twits:${(Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()}`
        this.userId = userId
        this.message = message
        this.date = Date.now()
    }
}

module.exports = Twit