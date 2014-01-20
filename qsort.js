function scope(v,left,right)
{
	this.v = v;
	this.left = left;
	this.right = right;
}

qSortScope;

function LoadCode(toBeSorted)
{
	qSortScope = new scope(toBeSorted,0,toBeSorted.length -1);
	lineList[0] = callQsort;
}

function execNextLine()
{
	lineList[0](qSortScope);
}

function callQsort(scope)
{
	nextLine(-1,0);
	var outputStr = "Calling qsort, v:["+scope.v.toString()+"], left:" + scope.left +",right:"+scope.right;
	console.log(outputStr);
	$("textarea").attr("readonly","false");
	$("textarea").append(outputStr);
	//insert into order table
}


