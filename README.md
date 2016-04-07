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
Video demos:

[![Leds demo](https://img.youtube.com/vi/Iyq3biic_68/0.jpg)](https://www.youtube.com/watch?v=Iyq3biic_68)
[![Move demo](https://img.youtube.com/vi/dt2PuRKKooY/0.jpg)](https://www.youtube.com/watch?v=dt2PuRKKooY)

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
sudo node index.js
```

## Web UI

```Shell
git clone https://github.com/tralves/j5-pi2go.git
cd j5-pi2go-ui
npm install
npm run dev
```
