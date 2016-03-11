var raspi = require('raspi-io');
var five = require('johnny-five');
var SoftPWM = require('raspi-soft-pwm').SoftPWM;
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  // RGB Leds  
  var frontRGBLed = new five.Led.RGB({controller: "PCA9685", pins: [11, 10, 9] });  
  var rightRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [8, 7, 6]});
  var backRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [5, 4, 3]});
  var leftRGBLed = new five.Led.RGB({controller: "PCA9685",pins: [2, 1, 0]});
  
  // obstacle sensors
  var rightObstacleSensor = new five.Sensor.Digital('P1-7');
  var leftObstacleSensor = new five.Sensor.Digital('P1-11');
  var centerObstacleSensor = new five.Sensor.Digital('P1-13');
  
  // line sensors
  var rightLineSensor = new five.Sensor.Digital('P1-15');
  var leftLineSensor = new five.Sensor.Digital('P1-12');
  
  // button
  var button = new five.Button({pin: 'P1-16', isPullup:true});
  
  // light sensors
  var lightSensorFL = new five.Sensor({pin: 0,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
  var lightSensorFR = new five.Sensor({pin: 1,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
  var lightSensorBL = new five.Sensor({pin: 2,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
  var lightSensorBR = new five.Sensor({pin: 3,freq: 250,board: new five.Board.Virtual(new five.Expander("PCF8591"))});
  
  // motors
  function PiMotor(motorLeftForward, motorLeftBackward, motorRightForward, motorRightBackward) {
  
    this.range = 100; // set the range to 0 - 100
    this.motorLeftForward = new SoftPWM({pin: 'P1-26', range: this.range, frequency: 200}); 
    this.motorLeftBackward = new SoftPWM({pin: 'P1-24', range: this.range, frequency: 200}); 
    this.motorRightForward = new SoftPWM({pin: 'P1-19', range: this.range, frequency: 200}); 
    this.motorRightBackward = new SoftPWM({pin: 'P1-21', range: this.range, frequency: 200});  
  
    // stop(): Stops both motors
    this.stop = function() {
      this.motorLeftForward.write(0);
      this.motorLeftBackward.write(0);
      this.motorRightForward.write(0);
      this.motorRightBackward.write(0);
    };
  
    // forward(speed): Sets both motors to move forward at speed. 0 <= speed <= 100
    this.forward = function (speed) {
      this.motorLeftForward.write(this.normalizeSpeed(speed));
      this.motorLeftBackward.write(0);
      this.motorRightForward.write(this.normalizeSpeed(speed));
      this.motorRightBackward.write(0);
    }  
    
    // reverse(speed): Sets both motors to reverse at speed. 0 <= speed <= 100
    this.reverse = function (speed) {
      this.motorLeftForward.write(0);
      this.motorLeftBackward.write(this.normalizeSpeed(speed));
      this.motorRightForward.write(0);
      this.motorRightBackward.write(this.normalizeSpeed(speed));
    }  
    
    // spinLeft(speed): Sets motors to turn opposite directions at speed. 0 <= speed <= 100
    this.spinLeft = function (speed) {
      this.motorLeftForward.write(0);
      this.motorLeftBackward.write(this.normalizeSpeed(speed));
      this.motorRightForward.write(this.normalizeSpeed(speed));
      this.motorRightBackward.write(0);
    }  
    
    // spinRight(speed): Sets motors to turn opposite directions at speed. 0 <= speed <= 100
    this.spinRight = function (speed) {
      this.motorLeftForward.write(this.normalizeSpeed(speed));
      this.motorLeftBackward.write(0);
      this.motorRightForward.write(0);
      this.motorRightBackward.write(this.normalizeSpeed(speed));
    } 
    
    // turnForward(leftSpeed, rightSpeed): Moves forwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
    this.turnForward = function (leftSpeed, rightSpeed) {
      this.motorLeftForward.write(this.normalizeSpeed(leftSpeed));
      this.motorLeftBackward.write(0);
      this.motorRightForward.write(this.normalizeSpeed(rightSpeed));
      this.motorRightBackward.write(0);
    }
    
    // turnReverse(leftSpeed, rightSpeed): Moves backwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
    this.turnReverse = function (leftSpeed, rightSpeed) {
      this.motorLeftForward.write(0);
      this.motorLeftBackward.write(this.normalizeSpeed(leftSpeed));
      this.motorRightForward.write(0);
      this.motorRightBackward.write(this.normalizeSpeed(rightSpeed));
    }
    
    // go(leftSpeed, rightSpeed): controls motors in both directions independently using different positive/negative speeds. -100<= leftSpeed,rightSpeed <= 100    
    this.go = function (leftSpeed, rightSpeed) {      
      if (leftSpeed < 0) {
        this.motorLeftForward.write(0);
        this.motorLeftBackward.write(this.normalizeSpeed(Math.abs(leftSpeed)));        
      }
      else {
        this.motorLeftForward.write(this.normalizeSpeed(leftSpeed));   
        this.motorLeftBackward.write(0); 
      }
      
      if (rightSpeed < 0) {
        this.motorRightForward.write(0);
        this.motorRightBackward.write(this.normalizeSpeed(Math.abs(rightSpeed)));        
      }
      else {
        this.motorRightForward.write(this.normalizeSpeed(rightSpeed));   
        this.motorRightBackward.write(0); 
      }      
    }
    
    this.normalizeSpeed = function(speed) {
      return Math.min(this.range, Math.max(speed, 0));
    }
  };
 
  // proximity
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 'P1-8'//,
    //freq: 500
  });

  // DEBUG  
  var sensors = {
    rightObstacleSensor: rightObstacleSensor,
    leftObstacleSensor: leftObstacleSensor,
    centerObstacleSensor: centerObstacleSensor,
    
    rightLineSensor: rightLineSensor,
    leftLineSensor: leftLineSensor,
    
    //lightSensorFL: lightSensorFL,
    //lightSensorFR: lightSensorFR,
    //lightSensorBL: lightSensorBL,
    //lightSensorBR: lightSensorBR   
  }

  for (var sensorName in sensors) {
    var thisSensorName = sensorName;
    setSensorLogger(thisSensorName, sensors[sensorName]);
  }

  function setSensorLogger(sensorName, sensor){
    sensor.on("change", function() {
      console.log(sensorName+": "+this.value);
    });
  }
  
  
  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
  });

  button.on("release", function() {
    console.log( "Button released" );
  });

  var cm = 0;
  proximity.on("data", function() {
    cm = this.cm;
    //console.log("Proximity: ");
    //console.log("  cm  : ", this.cm);
    //console.log("  in  : ", this.in);
    //console.log("-----------------");
  });

  proximity.on("change", function() {
    console.log("The obstruction has moved: "+cm);
    //console.log(this);
  });
  
  this.repl.inject({
    frontRGBLed: frontRGBLed,
    backRGBLed: backRGBLed,
    leftRGBLed: leftRGBLed,
    rightRGBLed: rightRGBLed,
    button: button,
    sensors: sensors,
    m: new PiMotor(),
    proximity: proximity
  });
});