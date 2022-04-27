#pragma strict

var person : GameObject;
var airrobot : GameObject;
var spawn_position;
var timer = 0.0;
var currentMode;

//count
static var success = 0.0;
static var fail = 0.0;

//default case
var test_case = 0;

//spawn robot randomly
function Spawn_Airrobot(){
	airrobot = Instantiate(Resources.Load("AirrobotJ_X", GameObject));
	airrobot.transform.position = Vector3(Random.value,Random.value*0.5+0.5,Random.value*0.1-5.5);
	airrobot.transform.localScale = Vector3(1,0.7,1);;
	airrobot.renderer.material.color = Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0));
}

//spawn crowd randomly(intial position changed in personMove file)
function Spawn_Crowd(){
    person = Instantiate(Resources.Load("Person", GameObject));
	person.transform.position = Vector3(4*(Random.value-0.5),0.33,-2*Random.value - 10);
	person.transform.localScale = Vector3(0.1+0.3*Random.value,0.3,0.1+0.3*Random.value);
	person.renderer.material.color = Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0));
}

//Game instructions
var showText = true;
var textArea = new Rect(0,0,Screen.width, Screen.height);

//display
function OnGUI(){
    if(showText){
    	GUI.Label(textArea,"\nCurrent Mode: "+currentMode+"\nEasy Mode: [1]\nHard Mode: [2]\nCrazy Mode: [3]\nNightmare:"+
    	" [4]\nStop Mode: [space]" +"\n\nSummon Robot: [j]\nEndSummon Robot: [k]\n\nMain View: [a]\nReverse View: [s]\nOverhead View: [d]\n\n"+
    	"Success:"+success.ToString()+"\nFail:"+fail.ToString()+"\nSuccess Rate:" +(success/(success+fail)).ToString());
    }
}

function Start () {

}

function Update () {

    //spawning one new airrobot
    if (Input.GetButtonDown("Summon")){
    	Spawn_Airrobot();
    }
    
    if (Input.GetButtonDown("EndSummon")){
	    Destroy (GameObject.FindWithTag("Airrobot"));
    }
     
	//stop spawning crowds
	if (Input.GetButtonDown("StopMode")){
    	test_case = 0;
    	timer = 0.0;
    	currentMode = "Stop Mode";
    }
    
    //easy mode
    if (Input.GetButtonDown("EasyMode")){
    	test_case = 1;
    	timer = 0.0;
    	currentMode = "Easy Mode";
    }
    
    //hard mode
    if (Input.GetButtonDown("HardMode")){
    	test_case = 2;
    	timer = 4.0;
    	currentMode = "Hard Mode";
    }
    
    //crazy mode
    if (Input.GetButtonDown("CrazyMode")){
    	test_case = 3;
    	timer = 8.0;
    	currentMode = "Crazy Mode";
    }
    
    //test mode
    if (Input.GetButtonDown("TestMode")){
    	//test_1();
    	timer = 0.0;
    	currentMode = "Test Mode";
    }
    
    //reset timer
    if (Input.GetButtonDown("Nightmare")){
    	timer = 12.0;
    }
    timer += Time.deltaTime;
    
    //case 1
    if (timer>3 && test_case == 1){
    	Spawn_Crowd();
    	timer = 0.0;
    }
    
    //case 2
    if (timer>7 && test_case == 2){
    	Spawn_Crowd();
    	Spawn_Crowd();
    	Spawn_Crowd();
    	timer = 4.0;
    }		
    
    //case 3
    if(timer>11 && test_case == 3){
    	Insane();
    	timer = 8.0;
    }

}

//Generate a huge number of crowds.
function Insane(){
	for(var i=0;i<1000;i++ ){
		timer+=Time.deltaTime;
		if(timer>1.0){
			Spawn_Crowd();
		    timer = 0.0;
		    }
	}
}

/*
function test_1(){
	spawn_position = Vector3(1,0.33,-6);
	var spawncrowd = Instantiate(test, spawn_position, Quaternion.identity);
	spawncrowd.transform.Translate(0,0,0);
	
}
*/