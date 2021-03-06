var $ = require('jquery');
var DTW = require('dtw');
var Leap = require('leapjs');

var controller = new Leap.Controller({
    host: '127.0.0.1',
    port: 6437,
    enableGestures: true,
    frameEventName: 'animationFrame',
    useAllPlugins: true
});
controller.connect();


var point = (0, 0, 0);
var points = [];
var isDrawing = false;

Leap.loop({enableGestures: true}, function(frame){
    if(frame.hands.length <= 0){
	return;
    }

    if(keyTapped(frame)){
	console.log("key tapped!!!");

	if(!isDrawing){
	    console.log("start gesture");
	    points = [];
	}else{
	    console.log("end gesture");
	    console.log(points);
	}

	isDrawing = !isDrawing;
    }

    var hand = frame.hands[0];
    var finger = hand.indexFinger;
    point = getFingertip(finger);

    points.push(point);
});

function getFingertip(finger){
    var point = {"x": finger.tipPosition[0],
		 "y": finger.tipPosition[1],
		 "z": finger.tipPosition[2]
		};
    return point;
}

function keyTapped(frame){
    var gestures = frame.gestures;
    for (var i = 0; i < gestures.length; i++){
	if(gestures[i].type == "keyTap"){
	    return true;
	}
    }
    return false;
}



var ts = [[1, 2, 3, 4, 5],
	  [1, 2, 3, 4, 4],
	  [1, 3, 5],
	  [5, 5, 5, 5, 5]];


var dtw = new DTW();

for (var i = 0; i < ts.length; i++) {
    var cost = dtw.compute(points[0], points[i]);
    var path = dtw.path();

    var $result = $('<div>');
    var $t0 = $('<p>').text(points[0]);
    var $t1 = $('<p>').text(points[i]);
    var $cost = $('<p>').text('cost: ' + cost);
    $result.append($t0);
    $result.append($t1);
    $result.append($cost);

    $('#content').append($result);
}
