new Vue({
    el: '#app',
    data:{
        twits: [],
        twitMessage: '',
        enterAllow: true,
        isCardModalActive: false,
    },
    created: function(){
        console.log('create!!')
        socket.on('user connect', data => {
            log(data)
        })

        socket.on('twitUpdate', data => {
            log(data)
            this.twits = []
            data.forEach(id => {
                this.getTwit(id)
            })
            // let twitList = data.map(item => item = JSON.parse(item))
            //
            // this.twits = _.orderBy(twitList, ['date'], ['desc'])
            // this.twits.forEach(item => {
            //     item['fromNow'] = moment(item.date).fromNow()
            // })
            // log(twitList)
        })

        socket.on('onGetTwit', data => {
            log('onGetTwit: ', data)
            this.twits.push(data)
            this.twits = _.orderBy(this.twits, ['date'], ['desc'])
            this.twits.forEach(item => {
                item['fromNow'] = moment(parseInt(item.date)).fromNow()
            })
        })

        socket.on('onDeleteTwit', data => {
            log(data)
            this.twits.forEach((item, index) => {
                if(item.id === data) this.twits.splice(index, 1)
            })
        })

        this.getTwits()
    },

    methods: {
        onSubmit(){
            log(this.twitMessage)
            if(this.twitMessage.trim() === ''){
                log('none!')
                this.twitMessage = ''
                return
            }
            socket.emit('addTwit', {twit: this.twitMessage})
            this.twitMessage = ''
            this.twits = []
            this.$buefy.toast.open({
                message: 'Twitted!',
                type: 'is-success'
            })
        },

        onKeyupEnter(){
            if(!this.enterAllow) return
            this.onSubmit()
        },

        getTwits(){
            socket.emit('getTwits')
        },

        getTwit(id){
            socket.emit('getTwit', id)
        },

        deleteItem(id){
            socket.emit('deleteItem', id)
        },
    }
})