

//return the position of the robot in the world
function getUAV_transform()
{
	return transform;
}

//take other robots as obstacles and use potential field to get away
//return the position of all other robots
var otherRobots : Array;
var leftRobots : Array;	//left of the robots
var rightRobots : Array;  //right of the robots
var num_of_robots : int;
var num_of_left : int;
var num_of_right : int;

function detectRobots()
{
	otherRobots = new Array ();
	leftRobots = new Array ();
	rightRobots = new Array ();
	
	var robots = new Array();
    robots = GameObject.FindGameObjectsWithTag("Airrobot");
    num_of_robots = robots.length;
    
	//find all other robots
	for (var body in robots)
	{
		if((body.renderer.material.color!=renderer.material.color))
		{
			otherRobots.Push(body);
			if(body.transform.position.x >= transform.position.x)
				rightRobots.Push(body);
			else
				leftRobots.Push(body);
		}
	}
	num_of_left = leftRobots.length;
	num_of_right = rightRobots.length;
	
	return otherRobots;
}
