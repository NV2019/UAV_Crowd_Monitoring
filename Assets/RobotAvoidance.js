
var UAV : Transform;
var otherRobots : Array;

function robotAvoidance(hokuyo)
{
	UAV = hokuyo.getUAV_transform();
	otherRobots = new Array(hokuyo.detectRobots());	
	
	//print(hokuyo.detectRobots().length);
	//print(otherRobots.length);
	
	for (var body in otherRobots)
	{
		var potential_center = body.transform.position.x;
		// If within the range of the repulsion filed of 
		//   the obstacle(such as robots, walls, crowds),
		// the direction is in the direction of runaway
		// the value is magnitude * MAX_velocity
		var range = 3;
		var MAX_velocity = 12;
		// magnitude is within 0 - 1
		var magnitude;
		var distance;
		
		// Run away from the robot
		if(UAV.position.x >= potential_center-range && UAV.position.x<=potential_center) 	
		{
			distance = (potential_center-UAV.position.x);
			magnitude = (range-distance)/range;
			transform.Translate(-Time.deltaTime*magnitude*MAX_velocity, 0, 0, Space.World);
		}
		else if(UAV.position.x > potential_center && UAV.position.x<=potential_center+range) 	
		{
			distance = (UAV.position.x-potential_center);
			magnitude = (range-distance)/range;
			transform.Translate(Time.deltaTime*magnitude*MAX_velocity, 0, 0, Space.World);
		}
	}
}