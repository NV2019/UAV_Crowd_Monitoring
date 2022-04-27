

var theCamera : TheCamera;
var hokuyo : Hokuyo;
var ps : PerceptualSchema;
var ms : MotorSchema;
var controller : LowLevelController;

//animation variables
private var spin : AnimationState;

//define animation behaviors
function Start() {		
	spin = animation["Spin"];
	spin.layer = 1;
	spin.blendMode = AnimationBlendMode.Additive;
	spin.wrapMode = WrapMode.Loop;
	spin.speed = 2.0;
	
	theCamera = GetComponent(TheCamera);
	hokuyo = GetComponent(Hokuyo);
	ps = GetComponent(PerceptualSchema);
	ms = GetComponent(MotorSchema);
	controller = GetComponent(LowLevelController);
	
}

function Update () {

	animation.CrossFade("Spin");
	
    theCamera.detect();
	ps.perceptualSchema(theCamera, hokuyo);
	ms.motorSchema(ps);
	controller.control(ms, hokuyo);
	
}
