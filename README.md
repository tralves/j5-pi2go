j5-pi2go
========

<img src="http://4tronix.co.uk/store/resources/image/18/b7/b.jpg" height="200"> <img src="http://johnny-five.io/img/heres-johnny.png" height="200">

## Description
This is a [johnny-five](http://johnny-five.io/) interface for the awesome robot kit [Pi2Go](http://www.pi2go.co.uk/) (not Pi2Go-Lite!). With this, you will be able access most of the sensors, motors and leds in the Pi2Go.

I went with all the trouble of figuring out the right pins and johnny-five modules (even had to [implement one](https://github.com/tralves/raspi-soft-pwm)) to make your Pi2Go a nodebot ready to go!

### Coming soon!

This lib is becoming more independent and ready to drop on your node.js project. The following features are in the testing phase:

- Store the state of the robot. Ex: 
```
a = pi2go.centerObstacle; // a = false;
```
- Improved API;
- Listeners. Ex:
```
pi2go.on('center obstacle', function(val){
  // new obstacle!
})
```
Video demo:

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/Iyq3biic_68/0.jpg)](https://www.youtube.com/watch?v=Iyq3biic_68)

### What's working so far?
- RGB Leds (front, back, left, right);
- Obstacle sensors (right, left, center);
- Line sensors (left, right);
- Button;
- Light sensors (front/right, front/left, back/right, back/left);
- Motors!
- Front proximity sensor!

## Installation

```Shell
git clone https://github.com/tralves/j5-pi2go.git
npm install
sudo node j5pi2go.js
```

## Playing around

Once you start the bot (``sudo node j5pi2go.js``), you will see a bunch of logs from the sensors in the console. The following APIs are exposed through repl:

#### Motors
- ``>>> stop()``: Stops both motors
- ``>>> forward(speed)``: Sets both motors to move forward at speed. 0 <= speed <= 100
- ``>>> reverse(speed)``: Sets both motors to reverse at speed. 0 <= speed <= 100
- ``>>> spinLeft(speed)``: Sets motors to turn opposite directions at speed. 0 <= speed <= 100
- ``>>> spinRight(speed)``: Sets motors to turn opposite directions at speed. 0 <= speed <= 100
- ``>>> turnForward(leftSpeed, rightSpeed)``: Moves forwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
- ``>>> turnReverse(leftSpeed, rightSpeed)``: Moves backwards in an arc by setting different speeds. 0 <= leftSpeed,rightSpeed <= 100
- ``>>> go(leftSpeed, rightSpeed)``: controls motors in both directions independently using different positive/negative speeds. -100<= leftSpeed,rightSpeed <= 100    

#### RGBLeds
See the [johnny-five api](http://johnny-five.io/api/led.rgb/#api) for ``frontRGBLed``|``rightRGBLed``|``backRGBLed``|``leftRGBLed``.

Example:
``` 
>>> rightRGBLed.color("#ff00ff");
>>> rightRGBLed.on();
>>> rightRGBLed.off();
```

## Next steps
- Make awesome web app to interact with the Pi2Go;
