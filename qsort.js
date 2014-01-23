function Scope(v,left,right)
{
	this.v = v;
	this.left = left;
	this.right = right;
}

	source = [["qsort(v[],int left, int right)","0"],
				["{","0;"],
				["int i;","5em;"],
				["int last;","5em;"],
				["if(left >= right)","5em;"],
				["return;","10em;"],
				["swap(v,left, (left + right)/2);","5em;"],
				["last = left;","5em;"],
				["for(i = left + 1;i<= right;i++){","5em;"],
				["if(v[i] < v[left]){","10em;"],
				["swap(v,++last,i)","15em;"],
				["}","10em;"],
				["}","5em;"],
				["swap(v,left,last);","5em;"],
				["qsort(v,left, last -1);","5em;"],
				["qsort(v,last+1,right);","5em;"],
				["}","0;"]];
				


function LoadCode(toBeSorted)
{
	qSortScope = new Scope(toBeSorted,0,toBeSorted.length -1);
//	lineList[callQsort.prototype.stackNum = 0] = callQsort;
//	lineList[checkIfLeftgtRight.prototype.stackNum = 1] = checkIfLeftgtRight;
//	lineList[insideIfReturn.prototype.stackNum =2] = insideIfReturn;
	
	qSortFrame = new Frame(qSortScope);
	qSortFrame.nextFunction = callQsort;
	return qSortFrame;
}

function execNextLine(qSortFrame)
{
	qSortFrame = qSortFrame.nextFunction(qSortFrame);
	return qSortFrame;
}

function callQsort(qSortFrame)
{
	
		nextLine(qSortFrame.prevline,qSortFrame.nextLine);
		qSortFrame.prepareNextLineSelection();
		var Lscope = qSortFrame.scope;
		var outputStr = "Calling qsort, v:["+Lscope.v.toString()+"], left:" + Lscope.left +",right:"+Lscope.right;
		outputToDivConsole(outputStr);
		outputCurrentSortOrder(Lscope.v);
		outputToStackTable("qSort(array,"+Lscope.left+","+Lscope.right+")",qSortFrame.callStack.length)
		qSortFrame.nextFunction = checkIfLeftgtRight;
		qSortFrame.callStack.push(Lscope);
		
		return qSortFrame;
	
}

function checkIfLeftgtRight(qSortFrame)
{
		nextLine(qSortFrame.prevline,4);
		qSortFrame.prepareNextLineSelection();
		var Lscope = qSortFrame.scope;
		var tf;
		var outputStr = "left>=right " + Lscope.left +">="+Lscope.right +"? "+(tf = (qSortFrame.scope.left >= qSortFrame.scope.right));
		outputToDivConsole(outputStr);
		if(tf){
			qSortFrame.nextFunction = insideIfReturn;
		}
		else{
			qSortFrame.nextFunction = swapLeftandMid;
		}
		return qSortFrame;

}

function insideIfReturn(qSortFrame)
{
		outputToDivConsole("returning to calling function. returns nothing");
		nextLine(qSortFrame.prevline,5);
		qSortFrame.prepareNextLineSelection();
		qSortFrame.popStack();
		qSortFrame.nextFunction = callQsort;
		qSortFrame.prepareNextLineSelection(0);
		markStackFrameForDeletion(qSortFrame.callStack.length);
		return qSortFrame;
	
}

function swapLeftandMid(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	var mid = Math.floor((Lscope.left + Lscope.right)/2);
	
	
	outputToDivConsole("swaping left: v[" +Lscope.left+"]: "+Lscope.v[Lscope.left]+" and the mid - ( left + right)/2 : v["+mid+"]: "+ Lscope.v[mid]);
	nextLine(qSortFrame.prevline,6);
	qSortFrame.prepareNextLineSelection();
	qSortFrame.nextFunction = assignLast;
	callSwaps(Lscope.v,Lscope.left,mid);
	outputToDivConsole("Current state: v:["+Lscope.v.toString()+"], left:" + Lscope.left +",right:"+Lscope.right);
	return qSortFrame;	
}

function assignLast(qSortFrame)
{
	nextLine(qSortFrame.prevline,7);
	qSortFrame.prepareNextLineSelection();
	outputToDivConsole("assigning the value of left: "+ qSortFrame.scope.left +"to the variable last");
	qSortFrame.scope.last = qSortFrame.scope.left;
	//qSortFrame.nextFunction = ;
	return qSortFrame;
}


