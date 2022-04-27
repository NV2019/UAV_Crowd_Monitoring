
//bounds definition
var ZUpperBound = -5.4;
var ZLowerBound = -5.6;

//proximity variables
var ignore = ZLowerBound - 6.0;
var social = ZLowerBound - 4.5;
var personal = ZLowerBound - 3.0;
var intimate = ZLowerBound - 1.5;
var stopThreshold = ZUpperBound + 1.0;

//states decided by PS
var state = "ignore";
var currentTarget : Transform;

// 	var ps : PerceptualSchema = GetComponent(PerceptualSchema);
function motorSchema(ps)
{
	currentTarget = ps.currentTarget;
	
	state = "ignore";
	
	/**/
	if(currentTarget != null)
	{
		var targetpos = currentTarget.position.z;
	 	if(targetpos > social){
			state = "calm";
		}
		if(targetpos > personal){
			state = "caution";
		}
		if(targetpos > intimate){
			state = "aggressive";
		}
		if(targetpos > stopThreshold){
			state = "ignore";
		}
	}
	
	/**/
	
	/**
		
	watch = GetComponent(Watching);
	approach = GetComponent(Approaching);
	threat = GetComponent(Threatening);
	
	state = watch.watching(ps);
	state = approach.approaching(ps);
	state = threat.threatening(ps);
	
	
	/**/
	
}