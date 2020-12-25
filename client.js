let websocket
let name
let connected = false
function connect() {
    name = document.getElementById('name')

    websocket = new WebSocket('wss://traviansserver.herokuapp.com');
    // websocket = new WebSocket('ws://localhost:8080');
    websocket.onopen = function (event) {
        websocket.send(JSON.stringify({ type: 'connect', name: name.value, position: { x: 0, y: 0 } }))

    };
    websocket.onmessage = handleGetMessage

    websocket.onclose = handleDisconnected
}

function move(newPosition) {
    websocket.send(JSON.stringify({
        type: 'move',
        name: name.value,
        position: newPosition
    }))
}

function setEventListener() {
    const blocks = document.querySelectorAll('.block')
    blocks.forEach(block => {
        block.addEventListener('click', (event) => {
            const y = block.parentElement.id[1]
            const x = block.id[1]
            move({ x, y })
        })
    })
}

function handleConnected() {
    const login = document.getElementById('login')
    const game = document.getElementById('game')

    game.classList.remove('hidden')
    game.classList.add('visible')
    login.classList.remove('visible')
    login.classList.add('hidden')
}
function handleDisconnected() {
    const login = document.getElementById('login')
    const game = document.getElementById('game')

    game.classList.add('hidden')
    game.classList.remove('visible')
    login.classList.add('visible')
    login.classList.remove('hidden')
}


function mapPositionsToGrid(players) {
    const blocks = document.querySelectorAll('.block')
    blocks.forEach(block => block.innerHTML = '')
    players.forEach(data => {
        const name = data.name
        const position = data.position
        row = document.querySelector('#r' + position.y)
        block = row.querySelector('#b' + position.x)
        block.innerHTML += name + "<br/>"

    })
}

function handleGetMessage(event) {
    if (event.data == "ERROR") {
        connected = false
        return
    }
    if (event.data == "CONNECTED") {
        connected = true
        handleConnected()
        setEventListener()
        return
    }
    mapPositionsToGrid(JSON.parse(event.data))
}