var UAV : Transform;

function wallAvoidance(hokuyo)
{
	UAV = hokuyo.getUAV_transform();
	
	//-------Define------------------------------
	// Using potential field to avoid the collision.
	var left_wall_bound_x : float;
	var right_wall_bound_x : float;

	var leftwall : GameObject;
	var rightwall : GameObject;

	// If within the range of the repulsion filed of 
	//   the obstacle(such as walls, crowd, ceiling, floor),
	// The direction is in the direction of runaway
	// The value is magnitude * MAX_velocity
	var range : float = 0.15;
	var MAX_velocity : float = 10;
	// magnitude is within 0 - 1
	var magnitude : float;
	var distance : float;


	leftwall = GameObject.Find("/Wall_Left");
	rightwall = GameObject.Find("/Wall_Right");
	
	var leftTransform : Transform;
	var rightTransform : Transform;
	
	leftTransform = leftwall.GetComponent(Transform);
	rightTransform = rightwall.GetComponent(Transform);
	
	left_wall_bound_x = leftTransform.position.x + 0.5 * leftTransform.localScale.x;
	right_wall_bound_x = rightTransform.position.x - 0.5 * rightTransform.localScale.x;
	
	var UAV_x_scale : float = transform.localScale.x ;

	
	//-----------Run Away----------------------------
	// Run away from the left wall
	if(UAV.position.x - UAV_x_scale < left_wall_bound_x)
	{
		UAV.position.x = left_wall_bound_x + UAV_x_scale;
	}
	if(UAV.position.x - UAV_x_scale >= left_wall_bound_x && 
	    UAV.position.x - UAV_x_scale <= left_wall_bound_x + range)	
	{
		distance = (UAV.position.x - UAV_x_scale) - left_wall_bound_x;
		magnitude = (range-distance)/range;
		transform.Translate(Time.deltaTime*magnitude*MAX_velocity, 0, 0, Space.World);
	}
	
	// Run away from the right wall	
	if(UAV.position.x + UAV_x_scale > right_wall_bound_x)
	{
		UAV.position.x = right_wall_bound_x - UAV_x_scale;
	}
	if(UAV.position.x + UAV_x_scale <= right_wall_bound_x && 
	    UAV.position.x + UAV_x_scale >= right_wall_bound_x - range)	
	{
		distance = right_wall_bound_x - (UAV.position.x + UAV_x_scale);
		magnitude = (range-distance)/range;
		transform.Translate(Time.deltaTime*magnitude*MAX_velocity, 0, 0, Space.World);
	}
}