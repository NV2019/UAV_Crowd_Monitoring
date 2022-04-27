#pragma strict

var hokuyo : Hokuyo;
var theCamera : TheCamera;


function testHokuyo() {
	//print("test Hokuyo:\n");
	hokuyo = GetComponent(Hokuyo);
	
	//test case 1
	//print (transform == hokuyo.getUAV_transform());
	
	//test case 2
	transform.position.x += 1; //change the position of the robot
	//print (transform == hokuyo.getUAV_transform());
	
	//test case 3
	transform.position.x -= 1; //change the position of the robot
    //print (transform == hokuyo.getUAV_transform());
	
}

var bodies : Array;

function testCamera() {
	
	//print("test Camera:\n");
	theCamera = GetComponent(TheCamera);
	bodies = new Array();
	
	bodies.Add(GameObject.Find("/Red"));
	bodies.Add(GameObject.Find("/Yellow"));
	bodies.Add(GameObject.Find("/Blue"));
	
	var percept: Array;
	percept = theCamera.detect();
	//print (bodies.length == percept.length);
}

function testFindCloset() {
	
}

function Start () {
	testHokuyo();
	testCamera();
	
	
}

function Update () {

}
