
//bounds definition
var ZUpperBound = -5.4;
var ZLowerBound = -5.6;
var guardLine = ZUpperBound;

//proximity variables
var social = ZLowerBound - 4.5;
var stopThreshold = ZUpperBound + 1.0;

//target variables
var currentTarget : Transform;
var targets : Array;
var dist = 0.0;

//range variables
var left_bound : float;
var right_bound : float;
var overlap = 3.0;
var magnitude = 0;

// 	var theCamera : TheCamera = GetComponent(TheCamera);
function perceptualSchema(theCamera, hokuyo)
{
	//detect the position information of other robots
	hokuyo.detectRobots();	
	//get range of acting of this robot
	  //get gap of two walls
	var leftwall = GameObject.Find("/Wall_Left");
	var rightwall = GameObject.Find("/Wall_Right");
	leftTransform = leftwall.GetComponent(Transform);
	rightTransform = rightwall.GetComponent(Transform);
	var left_wall_bound = leftTransform.position.x;
	var right_wall_bound = rightTransform.position.x;
	var gap = Mathf.Abs(left_wall_bound - right_wall_bound);
      //get magnitude of each region
    var num_of_robots = hokuyo.num_of_robots;
    if(num_of_robots == 0)
		Debug.Log("gap is unlimited");
	magnitude = gap/num_of_robots;
	  //get left and right bounds of the range
	left_bound = hokuyo.num_of_left * magnitude + left_wall_bound - overlap;
	right_bound = right_wall_bound - hokuyo.num_of_right * magnitude + overlap;

	if(transform.position.x < left_bound || transform.position.x > right_bound)
	{
		var call_controller = GetComponent(LowLevelController);
		call_controller.keepInRange(left_bound, right_bound);
	}
	
	print(left_bound);
	print(right_bound);

	targets = new Array(theCamera.bodies);	
	// Find Targets
	var newTargets = new Array ();
	for (var body in theCamera.bodies)
	{
		// if position of the body less than stop threshold or bigger than social, set as target;
		// and if body go back, ignore the body.
		if(body.transform.position.z < stopThreshold && body.transform.position.z > social && 
		   !body.GetComponent(PersonMove).goBack)
		{
			//only focus on bodies that within the range
			if(body.transform.position.x >= left_bound && body.transform.position.x <= right_bound)
			{
				newTargets.Push(body);
			}
		}
	}
	targets = newTargets;
		
	// Find Closest
	var closest : Transform = null;
	if(targets.length > 0){
		closest = targets[0].transform;
		var pos = targets[0].transform.position.z;
	
		//determine closest z-value
		for (var body in targets)
		{
			if(body.transform.position.z > pos)
			{
				pos = body.transform.position.z;
				closest = body.transform;
			}	
		}
	}	
	currentTarget = closest;
}	
