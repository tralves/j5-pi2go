import raspi from 'raspi-io';
import five from 'johnny-five';
import {SoftPWM} from 'raspi-soft-pwm';
import Emitter from 'tiny-emitter';
import _ from 'lodash'

export class Pi2Go extends Emitter {

	constructor(withRepl) {

		super();

		this._initialized = false;

		this._withRepl = withRepl;
		this._debug = false;

		this.board = new five.Board({
		  io: new raspi()
		});

		let that = this;

		this.board.on('ready', function() {
			that.initBoard();

			if (withRepl) { that.activateRepl(); }

			that.createListeners();

			this.emit('initialized');

			console.log('emitted initialized');
		});

		// sensor data
		this._obstacle = {
			left: false,
			center: false,
			right: false
		}
		this._line = {
			left: false,
			right: false
		}
		this._light = {
			frontLeft: 0,
			frontRight: 0,
			backLeft: 0,
			backRight: 0,
		}

		// button
		this._button = 'release'

		// proximity
		this._proximity = 0

	}

	// sensor accessors
	get obstacle () { return this._obstacle }
	get line () { return this._line }
	get light () { return this._light }

	// button accessor
	get button () { return this._button }

	// proximity accessor
	get proximity () { return this._proximity }

	get fullState () { return this.getFullState() }

	get initialized() { return this._initialized }

	get debug () { return this._debug }

	set debug (value) { this._debug = value}

	updateFrontRGBLed(params) {
		this._updateLed(this.frontRGBLed, params)
	}

	updateRightRGBLed(params) {
		this._updateLed(this.rightRGBLed, params)
	}

	updateBackRGBLed(params) {
		this._updateLed(this.backRGBLed, params)
	}

	updateLeftRGBLed(params) {
		this._updateLed(this.leftRGBLed, params)
	}

	_updateLed(led, params) {
		if (params.intensity == 0) {
			led.off()
		}
		else {
			led.on()
			led.color(params.color)
			led.intensity(params.intensity)
		}
	}

	go(leftSpeed, rightSpeed) {
		this._motorGo(leftSpeed, rightSpeed)
	}

	initBoard() {
		this.frontRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [11, 10, 9] });  
		this.rightRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [8, 7, 6]});
		this.backRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [5, 4, 3]});
		this.leftRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [2, 1, 0]});

		// obstacle sensors
		this.rightObstacleSensor = new five.Sensor.Digital('P1-7');
		this.leftObstacleSensor = new five.Sensor.Digital('P1-11');
		this.centerObstacleSensor = new five.Sensor.Digital('P1-13');

		// line sensors
		this.rightLineSensor = new five.Sensor.Digital('P1-15');
		this.leftLineSensor = new five.Sensor.Digital('P1-12');

		// button
		this.buttonSensor = new five.Button({pin: 'P1-16', isPullup:true});

		// light sensors
		this.lightSensorFL = new five.Sensor({pin: 0,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
		this.lightSensorFR = new five.Sensor({pin: 1,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
		this.lightSensorBL = new five.Sensor({pin: 2,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
		this.lightSensorBR = new five.Sensor({pin: 3,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});

		// motors
		this._range = 100; // set the range to 0 - 100
		this._motorLeftForward = new SoftPWM({pin: 'P1-26', range: this._range, frequency: 200}); 
		this._motorLeftBackward = new SoftPWM({pin: 'P1-24', range: this._range, frequency: 200}); 
		this._motorRightForward = new SoftPWM({pin: 'P1-19', range: this._range, frequency: 200}); 
		this._motorRightBackward = new SoftPWM({pin: 'P1-21', range: this._range, frequency: 200});  

		// stop(): Stops both motors
		this._motorStop = function() {
		  this._motorLeftForward.write(0);
		  this._motorLeftBackward.write(0);
		  this._motorRightForward.write(0);
		  this._motorRightBackward.write(0); 
		};

		// forward(speed): Sets both motors to move forward at speed. 0 <= speed <= 100
		this._motorForward = function (speed) {
		  this._motorLeftForward.write(this.normalizeSpeed(speed));
		  this._motorLeftBackward.write(0);
		  this._motorRightForward.write(this.normalizeSpeed(speed));
		  this._motorRightBackward.write(0);
		}  

		// reverse(speed): Sets both motors to reverse at speed. 0 <= speed <= 100
		this._motorReverse = function (speed) {
		  this._motorLeftForward.write(0);
		  this._motorLeftBackward.write(this.normalizeSpeed(speed));
		  this._motorRightForward.write(0);
		  this._motorRightBackward.write(this.normalizeSpeed(speed));
		}  

		// spinLeft(speed): Sets motors to turn opposite directions at speed. 0 <= speed <= 100
		this._motorSpinLeft = function (speed) {
		  this._motorLeftForward.write(0);
		  this._motorLeftBackward.write(this.normalizeSpeed(speed));
		  this._motorRightForward.write(this.normalizeSpeed(speed));
		  this._motorRightBackward.write(0);
		}  

		// spinRight(speed): Sets motors to turn opposite directions at speed. 0 <= speed <= 100
		this._motorSpinRight = function (speed) {
		  this._motorLeftForward.write(this.normalizeSpeed(speed));
		  this._motorLeftBackward.write(0);
		  this._motorRightForward.write(0);
		  this._motorRightBackward.write(this.normalizeSpeed(speed));
		} 

		// turnForward(leftSpeed, rightSpeed): Moves forwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
		this._motorTurnForward = function (leftSpeed, rightSpeed) {
		  this._motorLeftForward.write(this.normalizeSpeed(leftSpeed));
		  this._motorLeftBackward.write(0);
		  this._motorRightForward.write(this.normalizeSpeed(rightSpeed));
		  this._motorRightBackward.write(0);
		}

		// turnReverse(leftSpeed, rightSpeed): Moves backwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
		this._motorTurnReverse = function (leftSpeed, rightSpeed) {
		  this._motorLeftForward.write(0);
		  this._motorLeftBackward.write(this.normalizeSpeed(leftSpeed));
		  this._motorRightForward.write(0);
		  this._motorRightBackward.write(this.normalizeSpeed(rightSpeed));
		}

		// go(leftSpeed, rightSpeed): controls motors in both directions independently using different positive/negative speeds. -100<= leftSpeed,rightSpeed <= 100    
		this._motorGo = function (leftSpeed, rightSpeed) {      
		  	if (leftSpeed < 0) {
		    	this._motorLeftForward.write(0);
		    	this._motorLeftBackward.write(this.normalizeSpeed(Math.abs(leftSpeed)));        
		  	}
		  	else {
		    	this._motorLeftForward.write(this.normalizeSpeed(leftSpeed));   
		    	this._motorLeftBackward.write(0); 
		  	}
		  
		  	if (rightSpeed < 0) {
		    	this._motorRightForward.write(0);
		    	this._motorRightBackward.write(this.normalizeSpeed(Math.abs(rightSpeed)));        
		  	}
		  	else {
			    this._motorRightForward.write(this.normalizeSpeed(rightSpeed));   
			    this._motorRightBackward.write(0); 
		  	}      
		}

		// proximity
		// this.proximitySensor = new five.Proximity({
		// 	controller: "HCSR04",
		// 	pin: 'P1-8',
		// 	freq: 200
		// });

		this._initialized = true;
	}

	normalizeSpeed(speed) {
		return Math.min(this._range, Math.max(speed, 0));
	}

	activateRepl() {

		var me = this

		this.board.repl.inject({
			frontRGBLed: this.frontRGBLed,
			backRGBLed: this.backRGBLed,
			leftRGBLed: this.leftRGBLed,
			rightRGBLed: this.rightRGBLed,
			button: this.button,
			//motor: this._motor,
			proximity: this.proximitySensor,

			getFullState: me.getFullState
		});
	}

	createListeners() {

		let me = this;

		setSensorListener('obstacle', 'left', me.leftObstacleSensor)
		setSensorListener('obstacle', 'center', me.centerObstacleSensor)
		setSensorListener('obstacle', 'right', me.rightObstacleSensor)

		setSensorListener('line', 'left', me.leftLineSensor)
		setSensorListener('line', 'right', me.rightLineSensor)

		function setSensorListener(sensorType, sensorPos, sensor) {
			sensor.on("change", function() {

				if (isSensorTypeBoolean(sensorType)){
					me['_'+sensorType][sensorPos] = (this.value != 1)
				}
				else {
					me['_'+sensorType][sensorPos] = this.value
				}

				if(me._debug) {
					console.log(sensorType + " " + sensorPos + ": " + me['_'+sensorType][sensorPos]);
				}
		  		
				me.emit(sensorType + " " + sensorPos, me['_'+sensorType][sensorPos])
			});
		}

		function isSensorTypeBoolean(sensorType){
			return sensorType !== 'light';
		}

		setButtonListener('hold',me.buttonSensor)
		setButtonListener('press',me.buttonSensor)
		setButtonListener('release',me.buttonSensor)

		function setButtonListener(buttonState,button) {
			button.on(buttonState, function(){
				if(me._debug) {
					console.log( "Button " + buttonState);
				}
				me._button = buttonState
				me.emit('button', buttonState)
			})
		}

		// var cm = 0;
		// me.proximitySensor.on("data", function() {
		// 	cm = this.cm;
		// });

		// function sendProximityEvent() {
		// 	if(this._debug) {
		// 		console.log("proximity: " + cm);
		// 	}
		// 	me._proximity = cm
		// 	me.emit('proximity', cm)
		// }

		// me.proximitySensor.on("change",	sendProximityEvent);
	}

	getFullState(){
		return {
			'obstacle': this.obstacle,
			'line': this.line,
			'light': this.light,
			'proximity': this.proximity
		}
	}

}
