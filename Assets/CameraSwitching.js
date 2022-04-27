var cameraWV = null;
var cameraRV = null;
var cameraOV = null;

var cameraIndex = 1;

var target : Transform;

function Start () {
	cameraWV = GameObject.Find("Main Camera");
	if(cameraWV == null){
		Debug.Log("World view camera not found.");	
	}	
	
	cameraRV = GameObject.Find("Reverse Camera");
	if(cameraRV == null){
		Debug.Log("Reverse camera not found.");	
	}
	
	cameraOV = GameObject.Find("Overhead Camera");
	if(cameraOV == null){
		Debug.Log("Overhead camera not found.");	
	}
}

function Update () {
	if(Input.GetButtonDown("MainCamera")){
		cameraIndex = 1;
	}
	if(Input.GetButtonDown("OverheadCamera")){
		cameraIndex = 2;	
	}
	if(Input.GetButtonDown("ReverseCamera")){
		cameraIndex = 3;	
	}
	
	
	if(cameraWV != null){
		cameraWV.camera.enabled = (cameraIndex == 1);	
	}	
	if(cameraRV != null){
		cameraRV.camera.enabled = (cameraIndex == 2);	
	}
	if(cameraOV != null){
		cameraOV.camera.enabled = (cameraIndex == 3);	
	}
}
