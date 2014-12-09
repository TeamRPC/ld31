var express = require('express');
var http = require('http');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var moment = require('moment');
var maze = require('./maze');

// Serve the game html css js
// ==========================

var port = 8080;

app.use(express.static(__dirname + '/client'));

server.listen(port);
console.log('server listening on port ' + port);
console.log('status page at localhost:' + port + '/status');

app.get('/status', function(req, res) {
    res.send(players);
});


// Handle the game multiplayer
// ===========================

// some vars
var availableCursors = [0, 1, 2, 3, 5, 6];
var players = {};
var roundLength = moment({seconds: 10});



// some functions
var getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getUID = function getUID() {
    // thanks to http://stackoverflow.com/a/1349426/1004931
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // get a unique string
    var provenUnique = false;
    while (!provenUnique) {
	var id = "";
	for (var i = 0; i < 5; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	if (!players[id]) provenUnique = true;
    }
    return id;
}

var getCursor = function getCursor() {
    return availableCursors[Math.floor(Math.random() * (availableCursors.length + 1))];
}


var round = {
    startTime: null,
    next: function nextRound() {
        // only 1 player is in game, no next round possible.
        if (players.length === 0) {
            return null;
        }

        // 2 players are in game, so next game in 3s
        else if (players.length === 1) {
            return moment().add(3, 'seconds')
        }

        // game is already in progress, so next game is when this game is over
        else {
            return moment(this.startTime).add(roundLength);
        }
    },
    start: function startRound(socket) {
        var level = maze.generate();
        this.startTime = moment();
        socket.emit('start', {
            level: level,
            boss: getRandomInt(0, players.length),
            time: this.startTime
        });
    }
}


// socket


io.on('connection', function(socket) {

    // new player joined
    // assign a unique ID
    var player = {};
    player['id'] = getUID();
    player['cursor'] = getCursor();


    // if this is the only player in the game
    if (players.length === 0) {
        socket.emit('join', {
            msg: '1 more player needed to start',
            id: player.id,
            cursor: player.cursor
        });
    }
    
    // there is 1 player in the game
    // start game in 3 seconds
    else if (players.length === 1) {
        socket.emit('join', {
            msg: 'GET READY!',
            cursor: player.cursor,
            id: player.id,
            nextRound: round.next()
        });
    }
    
    // there is more than 1 player already in game
    else {
        socket.emit('join', {
            msg: 'next round starts in: ',
            id: player.id,
            cursor: player.cursor,
            nextRound: round.next()
        });
    }
    
    // add this player to array holding current players
    console.log('new player ' + player.id + ' added');
    players[player.id] = {
        id: player.id,
        cursor: player.cursor
    };
    console.dir(players);


    // emit movement updates when player sends them
    socket.on('move', function(p) {
        player['x'] = p.x;
        player['y'] = p.y;

        socket.broadcast.emit('move', {
            id: p.id,
            x: p.x,
            y: p.y
        });
    });
    
    round.start(socket);
    
    // player disconnect
    socket.on('disconnect', function(p) {
	console.log('player ' + player.id + ' disconnect');
	delete players[player.id]
    });
});

