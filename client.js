let websocket
let name
let connected = false
let X = 1,
    Y = 1
let playerName
terrain = ""
players = ""

function connect() {
    name = document.getElementById('name')
    playerName = name.value
    // websocket = new WebSocket('wss://traviansserver.herokuapp.com/ws');
    websocket = new WebSocket('ws://localhost:8080/ws');
    websocket.onopen = function (event) {
        websocket.send(JSON.stringify({
            type: 'CONNECT',
            player: {
                name: playerName
            },
        }))

    };
    websocket.onmessage = handleGetMessage

    websocket.onclose = handleDisconnected
}

function move(newPosition) {
    websocket.send(JSON.stringify({
        type: 'move',
        player: {
            name: playerName
        },
        move: newPosition
    }))
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

function handleGetMessage(event) {
    if (event.data == "ERROR") {
        connected = false
        return
    }
    if (event.data == "CONNECTED") {
        connected = true
        handleConnected()
        return
    }
    console.log(event.data)
    const incomingData = JSON.parse(event.data)
    if(incomingData.type == "TERRAIN") {
        terrain = incomingData.data
        return
    }
    if(incomingData.type == "PLAYERS") {
        players = incomingData.data
        const thisPlayer = players.find(pl => pl.name == playerName)
        X = thisPlayer.x
        Y = thisPlayer.y
        return
    }


}

function keyPressed() {
    movePlayer()
}


const mvmspeed = 1

function movePlayer() {
    if(!terrain)return
    if (keyCode === LEFT_ARROW) {
        X -= mvmspeed
    } else if (keyCode === RIGHT_ARROW) {
        X += mvmspeed
    } else if (keyCode === UP_ARROW) {
        Y -= mvmspeed
    } else if (keyCode === DOWN_ARROW) {
        Y += mvmspeed
    }
    X = clampNumber(X, 0, terrain.width - 1)
    Y = clampNumber(Y, 0, terrain.height - 1)
    sendMovePlayer(playerName, X, Y)
}

function sendMovePlayer(name, x, y){
    if(websocket){
        websocket.send(JSON.stringify({
            type:"MOVE",
            player: {name},
            move: {x,y}
        }))
    }
}

function clampNumber(num, min, max) {
    return Math.min(Math.max(num, min), max);
}