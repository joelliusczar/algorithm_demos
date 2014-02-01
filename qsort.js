var formatStr = JSON.stringify;

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
	qSortScope = {v:toBeSorted,returnAddressFunction: terminalCall,left: 0, right: toBeSorted.length -1}
	myFrame = new Frame(qSortScope);
	
	myFrame.nextFunction = callQsort;
	execNextLine(myFrame);
	return myFrame;
}


function callQsort(qSortFrame)
{
	
		qSortFrame.nextLine(0);
		var Lscope = qSortFrame.scope;
		outputToDivConsole("Calling qSort");
		outputToDivConsole(formatStr(Lscope));
		outputCurrentSortOrder(Lscope.v);
		outputToStackTable("qSort(array,"+Lscope.left+","+Lscope.right+")",qSortFrame.callStack.length-1);
		qSortFrame.nextFunction = checkIfLeftgtRight;
		updateCounter(1);
}

function checkIfLeftgtRight(qSortFrame)
{
		qSortFrame.nextLine(4);
		var Lscope = qSortFrame.scope;
		var outputStr = formatCondtionStr({type: "if",test: ">=",v:Lscope.v,index1:Lscope.left,index2: Lscope.right,
			compare: function(a,b){ return a >= b}});
		outputToDivConsole(outputStr);
		if(Lscope.left >= Lscope.right){
			qSortFrame.nextFunction = insideIfReturn;
		}
		else{
			qSortFrame.nextFunction = swapLeftandMid;
		}
		updateCounter(1);
}

function insideIfReturn(qSortFrame)
{
		qSortFrame.nextLine(5);
		genericReturn(qSortFrame);
		
}

function swapLeftandMid(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	var mid = Math.floor((Lscope.left + Lscope.right)/2);
	
	qSortFrame.nextLine(6);
	qSortFrame.nextFunction = assignLast;
	callSwaps(Lscope.v,Lscope.left,mid);
	outputToDivConsole(formatStr(Lscope));
	outputCurrentSortOrder(Lscope.v);
}

function assignLast(qSortFrame)
{
	qSortFrame.nextLine(7);
	qSortFrame.scope.last = qSortFrame.scope.left;
	outputToDivConsole(formatStr(qSortFrame.scope));
	qSortFrame.nextFunction = initialForStatement;
	updateCounter(1);
}

function initialForStatement(qSortFrame)
{

	qSortFrame.scope.i = qSortFrame.scope.left + 1;
	genericForCondition(qSortFrame);
	
}

function genericForCondition(qSortFrame)
{
	qSortFrame.nextLine(8);
	outputToDivConsole(formatCondtionStr({type:"for loop",test: "<=",index1: qSortFrame.scope.i,
		index2: qSortFrame.scope.right,compare: function(a,b){return a <= b}}));
	if(qSortFrame.scope.i <= qSortFrame.scope.right){
		qSortFrame.nextFunction = iflessThanLeftCondition;
	}
	else{
		qSortFrame.nextFunction = swapLeftAndLast;
	}
	updateCounter(1);
}

function iflessThanLeftCondition(qSortFrame)
{
	qSortFrame.nextLine(9);
	var Lscope = qSortFrame.scope;
	outputToDivConsole(formatCondtionStr({type:"if",test:"<",v:Lscope.v,index1: Lscope.i,index2:Lscope.left,
		compare: function(a,b){return a < b}}));
	
	if(Lscope.v[Lscope.i] < Lscope.v[Lscope.left]){
		qSortFrame.nextFunction = conditionalSwap;
	}
	else{
		qSortFrame.nextFunction = endSwapIfBlock;
	}
	updateCounter(1);
}

function conditionalSwap(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	qSortFrame.nextLine(10);
	outputToDivConsole(formatStr(Lscope));
	callSwaps(Lscope.v,++Lscope.last,Lscope.i);
	qSortFrame.nextFunction = endSwapIfBlock;
	outputCurrentSortOrder(Lscope.v);
}

function endSwapIfBlock(qSortFrame)
{
	qSortFrame.nextLine(11);
	qSortFrame.nextFunction = repeatForStatement;
}

function repeatForStatement(qSortFrame)
{
	qSortFrame.nextLine(12);
	qSortFrame.scope.i++;
	genericForCondition(qSortFrame);
	updateCounter(1);
}

function endForBlock(qSortFrame)
{
	qSortFrame.nextLine(12);
	qSortFrame.nextFunction = swapLeftAndLast;
}

function swapLeftAndLast(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	qSortFrame.nextLine(13);
	outputToDivConsole(formatStr(Lscope));
	callSwaps(Lscope.v,Lscope.left,Lscope.last);
	qSortFrame.nextFunction = recursiveCallQSort;
	outputCurrentSortOrder(Lscope.v);
}

function recursiveCallQSort(qSortFrame)
{	
	
	var oldV = qSortFrame.scope.v;
	var oldLast = qSortFrame.scope.last;
	var oldLeft = qSortFrame.scope.left;
	qSortFrame.nextLine(14);
	qSortFrame.callStack.push(qSortFrame.scope);
	qSortFrame.scope = {v:oldV,returnAddressFunction: returnAddressRecursiveCallQSort,left: oldLeft,right:oldLast-1};
	outputToDivConsole("Calling qSort recursively");
	qSortFrame.nextFunction = callQsort;
	
}

function returnAddressRecursiveCallQSort(qSortFrame)
{
	qSortFrame.nextLine(14);
	qSortFrame.nextFunction = recursiveCallQSortAgain;
}

function recursiveCallQSortAgain(qSortFrame)
{
	var oldV = qSortFrame.scope.v;
	var oldLast = qSortFrame.scope.last;
	var oldRight = qSortFrame.scope.right;
	qSortFrame.nextLine(15);
	qSortFrame.callStack.push(qSortFrame.scope);
	qSortFrame.scope = {v:oldV,returnAddressFunction: returnAddressAgain,left: oldLast+1,right:oldRight};
	outputToDivConsole("Calling qSort recursively");
	qSortFrame.nextFunction = callQsort;
	
}

function returnAddressAgain(qSortFrame)
{
	qSortFrame.nextLine(16);
	genericReturn(qSortFrame)
}

function genericReturn(qSortFrame)
{
	outputToDivConsole("Returning to calling function - stack pointer:" + qSortFrame.callStack.length -1);
	qSortFrame.nextFunction = qSortFrame.scope.returnAddressFunction;
	qSortFrame.popStack();
	markStackFrameForDeletion(qSortFrame.callStack.length);
	updateCounter(1);
}

function terminalCall(qSortFrame)
{
	qSortFrame.scope = undefined;
	pageCleanUp();
}




