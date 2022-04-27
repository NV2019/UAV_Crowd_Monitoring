
//bounds definition
var ZUpperBound = -5.4;
var ZLowerBound = -5.6;
var guardLine = ZUpperBound;

var YUpperBound = 1.0;
var YLowerBound = 0.9;

//proximity variables
var ignore = ZLowerBound - 6.0;
var social = ZLowerBound - 4.5;
var personal = ZLowerBound - 3.0;
var intimate = ZLowerBound - 1.5;

//rotation variables
var rotation = Vector3.zero;
var xRotation = 0.0;
var zRotation = 0.0;
var maxTilt = 15.0;

//movement variables
var movement = Vector3.zero;
var moveSpeed = 2.0;
var followDistance = 0.6;
var keepAliveSpeed = 1;
var goingup = false;
var keepInRangeSpeed = 3.0;

//transforms from sensor
var currentTarget : Transform;
var UAV : Transform;

// 	var ms : MotorSchema = GetComponent(MotorSchema);

var wall_avoid : WallAvoidance;

function control(ms, hokuyo)
{
	UAV = hokuyo.getUAV_transform();
	//components using sensor data from hokuyo
	wall_avoid = GetComponent(WallAvoidance);
	robot_avoid = GetComponent(RobotAvoidance);

	var state = ms.state;
	currentTarget = ms.currentTarget;
	
	var dist : float;
	if(currentTarget != null)
 		dist = guardLine - currentTarget.position.z;
	
	if(state == "calm"){
		findLine();
		maxTilt = Mathf.Abs((10-5)/(personal-social) * dist);
		moveSpeed = (1-.5)/(personal-social) * dist;
		followDistance = Mathf.Abs((1-2)/(personal-social) * dist);
		YUpperBound = 1.0;
		YLowerBound = 0.9;
		stalk();
		keepAliveSpeed = 1; //const
		keepAlive();
	}
	if(state == "caution"){
		findLine();
		maxTilt = 10.0; //const
		moveSpeed = (2-1)/(intimate-personal) * dist;
		followDistance = Mathf.Abs((.5-1)/(intimate-personal) * dist);
		YUpperBound = 0.9;
		YLowerBound = 0.8;
		stalk();

		// track center
		trackCenter();

		keepAliveSpeed = 1; //const
		keepAlive();
	}
	if(state == "aggressive"){
		findLine();
		maxTilt = 10.0; //const
		moveSpeed = 2.0; //const
		followDistance = 0.5; //const
		YUpperBound = 0.6;
		YLowerBound = 0.5;
		stalk();
		
		// move random 2D
		trackCenter();
		moveRandom2D();
		
		keepAliveSpeed = 1; //const
		keepAlive();
	}
	if(state == "ignore"){
		if(currentTarget == null){
			maxTilt = 0.0;
		}
		else{
			maxTilt = Mathf.Abs((5-0)/(social-ignore) * dist);
		}
		moveSpeed = 0.5; //const
		followDistance = 2.0; //const
		YUpperBound = 1.0;
		YLowerBound = 0.9;
		findLine();
		stabilize();
		keepAliveSpeed = 1; //const
		keepAlive();
	}
	
	// Avoid the walls will execute default
	wall_avoid.wallAvoidance(hokuyo);
	// Avoid the other robots will execute default
	robot_avoid.robotAvoidance(hokuyo);
}

function trackCenter()
{
	// Angular speed in radians per sec.
	var speed: float = 1080;

	var targetDir = currentTarget.position - UAV.position;
		
	// The step size is equal to speed times frame time.
	var step = speed * Time.deltaTime;
	    
	var newDir = Vector3.RotateTowards(transform.forward, targetDir, step, 0.0);
	Debug.DrawRay(UAV.position, newDir, Color.red);
	    // Move our position a step closer to the target.
	    
	transform.rotation = Quaternion.LookRotation(newDir);
}

function moveRandom2D()
{
	var maxStepX = 20;
	
    var stepX = Random.value * maxStepX;
	
	if(currentTarget.position.x > UAV.position.x)
	{
		transform.Translate(Time.deltaTime*stepX, 0, 0, Space.World);
	}
	else if(currentTarget.position.x < UAV.position.x)
	{
		transform.Translate(Time.deltaTime*-stepX, 0, 0, Space.World);
	}
	else
	{
		transform.Translate(0, 0, 0);
	}
}


//--------------------------------------------------------------------------------------------


//this tells the robot to move to the z-position specified by the z-bounds
function findLine(){
	var controller : CharacterController = GetComponent(CharacterController);
	
	//find the guard line
	if(UAV.position.z < ZLowerBound){
		controller.Move(new Vector3(0,0,.01));
	}
	if(UAV.position.z > ZUpperBound){
		controller.Move(new Vector3(0,0,-.01));
	}
}

//follow only in x direction
function stalk(){
	var tx = currentTarget.position.x;
	
	var myx = UAV.position.x;
	
	var diffx = tx - myx;
	
	//keep from tipping over
	if(zRotation > maxTilt)
	{
		zRotation = maxTilt;
	}
	if(zRotation < -maxTilt)
	{
		zRotation = -maxTilt;
	}
	if(xRotation > maxTilt)
	{
		xRotation = maxTilt;
	}
	if(xRotation < -maxTilt)
	{
		xRotation = -maxTilt;	
	}
	
	//keep within follow distance (x)
	if(diffx < -followDistance)
	{
		movement.x = Time.deltaTime * -moveSpeed;
		zRotation += 1;
	}
	else if(diffx > followDistance)
	{
		movement.x = Time.deltaTime * moveSpeed;
		zRotation -= 1;
	}
	else 
	{
		movement.x = 0.0;
	}
	
	//keep x value, but rotate forward
	if(xRotation > -maxTilt){
		xRotation -= 1;	
	}
	
	transform.Translate(movement.x, 0, 0, currentTarget.transform);
	transform.eulerAngles = Vector3(xRotation, 0, zRotation);
}


//this resets the robot's tilt and height to normal
function stabilize(){
	transform.eulerAngles = Vector3(0,0,0);
}

//this defines keep alive behavior - bobbing up and down
function keepAlive(){
	//Social distance: idle movement for when the person is far away
	if(UAV.position.y > YUpperBound){
		transform.Translate(0,Time.deltaTime*-keepAliveSpeed,0);
		goingup = false;
	}
	if(UAV.position.y < YLowerBound){
		transform.Translate(0,Time.deltaTime*keepAliveSpeed,0);
		goingup = true;
	}
	if(UAV.position.y <= YUpperBound && UAV.position.y >= YLowerBound){
		if(goingup){
			transform.Translate(0,Time.deltaTime*keepAliveSpeed,0);
			if(UAV.position.y >= YUpperBound)
				goingup = false;
		}
		if(!goingup){
			transform.Translate(0, Time.deltaTime*-keepAliveSpeed,0);
			if(UAV.position.y <= YLowerBound)
				goingup = true;
		}
	}
}

function keepInRange(left_bound, right_bound)
{
	keepInRangeSpeed = 3.0;
	if(UAV.position.x > right_bound)
	{
		transform.Translate(Time.deltaTime*-keepInRangeSpeed,0,0);
	}
	if(UAV.position.y < left_bound)
	{
		transform.Translate(Time.deltaTime*keepInRangeSpeed,0,0);
	}
}