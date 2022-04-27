

var bodies : Array;

//return all people in the crowd
function detect()
{
	bodies = new Array();
    bodies = GameObject.FindGameObjectsWithTag("Respawn");
	
	return bodies;
}
