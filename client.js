let websocket
let name, data

function connect() {
    name = document.getElementById('name')

    websocket = new WebSocket('ws://traviansserver.herokuapp.com/:8080');
    websocket.onopen = function (event) {
        websocket.send(name.value + " connected")
    };
    websocket.onmessage = function (event) {
        console.log(event.data);
    }
}

function send() {
    data = document.getElementById('data')
    websocket.send(data.value)
}