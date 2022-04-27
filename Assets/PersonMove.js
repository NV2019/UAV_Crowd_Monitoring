
   // We group adapts the idea of spawn from Wang, Zhuo's work to upgrade the project.
   // In this file, we add the part of counting the success rate and destroy obeject, etc.
   
//speed variables
var speed = 0.5;
var backSpeed = 0.0;

//movement variables
var startPos = Vector3.zero;
//var trans = 0.0;
var xMove = 0.0;
var zMove = 0.0;

//target variables
var target : Transform;
var goBack = false;

//spawn variables
var marked = false; 
var ZUpperBound = -5.4;
var stopThreshold = ZUpperBound + 1.0;

var back_wall_z;
var front_wall_z;
var right_wall_x;
var left_wall_x;

back_wall_z = GameObject.Find("Wall_Back").transform.position.z-0.4;
front_wall_z = GameObject.Find("Wall_Front").transform.position.z+0.4;
right_wall_x = GameObject.Find("Wall_Right").transform.position.x-0.4;
left_wall_x = GameObject.Find("Wall_Left").transform.position.x+0.4;

//position variables
var intimate = 1.5;
var personal = 3.0;
var social = 4.5;
var sqrLen = 0.0;

//bounds definition
var ZLowerBound = -5.6;

//proximity variables
var ignoreLine = ZLowerBound - 5.0;

var screenSpace;
var offset;

var airrobot : GameObject;

function Start(){

	//determine speed
	speed = (Random.value+1.0)*0.5 + 1.5;
	
	//determine random starting position within bounding box
	var startX = 18*(Random.value-0.5);
	var startZ = Random.Range(-2.0,-0.5) + ignoreLine;
	startPos = new Vector3(startX, 0.33, startZ);
	transform.position = startPos;
	
	//make the crowds move in various ways
	//set up a target for the crowd to reduce the chance of hitting the wall.
	var x_target = 0.5*(right_wall_x+left_wall_x)+(Random.value-0.5)*18;
	var z_target = 0.5*(back_wall_z+stopThreshold)+(Random.value-0.5)*4;
	var travel_route = 	Mathf.Sqrt((x_target-startX)*(x_target-startX)+(z_target-startZ)*(z_target-startZ));
	var t = travel_route/speed;
	xMove = (x_target-startX)*Time.deltaTime/t;
	zMove = (z_target-startZ)*Time.deltaTime/t;
	
	backSpeed = -zMove;
	
}

function Update () {
	
	//find target and determine distance between me and target
	var robots = new Array();
    robots = GameObject.FindGameObjectsWithTag("Airrobot");
	var target : Transform = null;
	//find Closest robot
	if(robots.length > 0){
		target = robots[0].transform;
		sqrLen = Mathf.Sqrt((target.position.x-transform.position.x)*(target.position.x-transform.position.x)+
	    	     (target.position.z-transform.position.z)*(target.position.z-transform.position.z));
	         
		for (var body in robots){
			temp = Mathf.Sqrt((body.transform.position.x-transform.position.x)*(body.transform.position.x-transform.position.x)+
	         		(body.transform.position.z-transform.position.z)*(body.transform.position.z-transform.position.z));
			if(temp < sqrLen){
				sqrLen = temp;
				target = body.transform;
			}	
		}
	}	
	
	if( sqrLen < social && !goBack){
		zMove += -.125 * Time.deltaTime * zMove;
	}
	if( sqrLen < personal && !goBack){
		zMove += -.25 * Time.deltaTime * zMove;
	}
	
	if( sqrLen < intimate || goBack){
		//too scared = leave
		xMove = 0.0;
		zMove = 1.2*backSpeed-Time.deltaTime*0.5;
		
		//stop at front wall
		if(transform.position.z >= -14){
			transform.Translate(xMove, 0, zMove);
		}
		
		goBack = true;
		//a successful block
		if(marked == false){
			Spawn.success += 1;
			marked = true;
		}
	}
	
	//stop at back wall
	if(transform.position.z < back_wall_z){
		transform.Translate(xMove, 0, zMove);
	}

		
	//robot fails if people pass the exit
	if(transform.position.z>stopThreshold && marked == false){
		Spawn.fail += 1;
		marked = true;
	}
	
	if(transform.position.z<front_wall_z+1 || transform.position.z>back_wall_z-1){
		
		Destroy(gameObject);
	}
	
	//Destroy redundant gameobject automatically.
	if((transform.position.x<left_wall_x+0.45 || transform.position.x>right_wall_x-0.45 || transform.position.y>6)){
		Destroy(gameObject);
	}
}


/**/
function OnMouseDown() {
    //translate the cubes position from the world to Screen Point
    screenSpace = Camera.main.WorldToScreenPoint(transform.position);
    //calculate any difference between the cubes world position and the mouses Screen position converted to a world point  
    offset = transform.position - Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y, screenSpace.z));
    
}
/**/


/*
OnMouseDrag is called when the user has clicked on a GUIElement or Collider and is still holding down the mouse.
OnMouseDrag is called every frame while the mouse is down.
*/

/**/
function OnMouseDrag () {
    //keep track of the mouse position
    var curScreenSpace = Vector3(Input.mousePosition.x, Input.mousePosition.y, screenSpace.z);
    //convert the screen mouse position to world point and adjust with offset
    var curPosition = Camera.main.ScreenToWorldPoint(curScreenSpace) + offset;
    //update the position of the object in the world
    
    
    transform.position = curPosition;
    
//    deltaz = curScreenSpace.x - screenSpace.x;
//    deltax = curScreenSpace.y - screenSpace.y;
//    
//    xMove += .125 * deltax;
//    zMove += .125 * deltaz;
//    
//    transform.Translate(xMove, 0, zMove);
    
    
}
