import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import dotenv from 'dotenv'

import  { Pi2Go }  from './lib/pi2go';

const port = process.env.PORT || 8080;
const app = express();
const server = http.Server(app);
const io = socketio(server);

const myPi2Go = new Pi2Go(true);
myPi2Go.debug = true;

console.log(myPi2Go);
console.log('myPi2Go initialized: ' + myPi2Go.initialized);
myPi2Go.on('initialized', function() {
  console.log('------- INIT');
  console.log('------- myPi2Go initialized: ' + myPi2Go.initialized);
});



const listeners = [
	'obstacle left',
	'obstacle center',
	'obstacle right',

	'line left',
	'line right',

	'light frontLeft',
	'light frontRight',
	'light backLeft',
	'light backRight',

	'button',

	'proximity'
]

Array.from(listeners).forEach(function( listener ) {
	myPi2Go.on(listener, function(value) {
		console.log('<SERVER>' + listener + ': ' + value);
	});
});


// //Socket connection handler
io.on('connection', function (socket) {  

 	console.log('SOCKET IN!!! ' + socket.id);

 	Array.from(listeners).forEach(function( listener ) {
		myPi2Go.on(listener, function(value) {
			socket.emit(listener, value);
		});
	});

 	socket.on("get full state", function (msg, callback) {
 		console.log('received get full state ' + msg);
 		console.log('full state ' + myPi2Go.fullState);
 		
 		socket.emit('full state', myPi2Go.fullState);
 	});

 	socket.on("set leds", function (msg, callback) {
 		console.log('set leds ');

 		if (msg.position == 'front') { myPi2Go.updateFrontRGBLed(msg) }
 		else if (msg.position == 'right') { myPi2Go.updateRightRGBLed(msg) }
 		else if (msg.position == 'back') { myPi2Go.updateBackRGBLed(msg) }
 		else if (msg.position == 'left') { myPi2Go.updateLeftRGBLed(msg) }
 	});

 	socket.on("motor go", function (msg, callback) {
 		console.log('motor go ');
 		myPi2Go.go(msg.left, msg.right)
 	});

});

server.listen(port);
console.log('Listening ...');