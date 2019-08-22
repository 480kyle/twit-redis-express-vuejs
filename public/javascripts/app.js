new Vue({
    el: '#app',
    data: {
        twits: [],
        twitMessage: '',
        enterAllow: true,
        isCardModalActive: false,
        selectedItem: {userId: 1, twit: '', date: Date.now()},
    },
    created: function () {
        console.log('create!!')
        socket.on('user connect', data => {
            log(data)
        })

        socket.on('onGetTwits', data => {
            log(data)
            data.forEach(item => {
                item['fromNow'] = moment(parseInt(item.date)).fromNow()
            })
            this.twits = data
        })

        socket.on('onAddTwit', data => {
            data['fromNow'] = moment(parseInt(data.date)).fromNow()
            log('onAddTwit: ', data)
            this.twits.splice(0, 0, data)
        })

        socket.on('onUpdateTwit', data => {
            log('onUpdateTwit: ', data)
            this.twits.map(item => {
                if(item.id === data.id) return item.message = data.message
            })
        })

        socket.on('onDeleteTwit', data => {
            log(data)
            this.twits.forEach((item, index) => {
                if (item.id === data) this.twits.splice(index, 1)
            })
        })

        this.getTwits()
    },

    methods: {
        onSubmit() {
            log(this.twitMessage)
            if (this.twitMessage.trim() === '') {
                log('none!')
                this.twitMessage = ''
                return
            }
            socket.emit('addTwit', {message: this.twitMessage})
            this.twitMessage = ''
            this.$buefy.toast.open({
                message: 'Twitted!',
                type: 'is-success'
            })
        },

        onKeyupEnter() {
            if (!this.enterAllow) return
            this.onSubmit()
        },

        getTwits() {
            socket.emit('getTwits')
        },

        getTwit(id) {
            socket.emit('getTwit', id)
        },

        updateItem (item) {
            socket.emit('updateTwit', item)
            this.isCardModalActive = false
        },

        deleteItem(id) {
            socket.emit('deleteItem', id)
        },

        onItemClick(item) {
            this.isCardModalActive = true
            this.selectedItem = _.clone(item)
            log(this.selectedItem)
        },
    }
})