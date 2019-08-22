let transports = ['websocket']
let option = {
    'force new connection': true,
    'transports': transports,
    'autoConnect': true,
    'reconnection': true,
    'timeout': 10000,
    'flash policy port': 10843,
    'reconnectionDelay': 1000
}
const socket = io('/', option)
socket.on('connect', data => {
    log(socket.id)
})
socket.on('connect ok', data => {
    log(data)
})