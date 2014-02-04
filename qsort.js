var leftcolor = "#f41ccd";
var rightcolor = "#fce94f";
var itercolor = "#729fcf";
var lastcolor = "#ad7fa8";

var formatStr = JSON.stringify;

QSort = {
sourceCode: [["qsort(v[],int left, int right)","0"],
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
				["}","0;"]],
LoadCode: function(toBeSorted)
{
	qSortScope = {v:toBeSorted,returnAddressFunction: QSort.terminalCall,left: 0, right: toBeSorted.length -1}
	var myFrame = new Frame(qSortScope);
	
	myFrame.nextFunction = QSort.callQsort;
	
	return myFrame;
},
callQsort: function(qSortFrame)
{
	
		qSortFrame.nextLine(0);
		var Lscope = qSortFrame.scope;
		outputToDivConsole("Calling qSort");
		outputToDivConsole(formatStr(Lscope));
		outputCurrentSortOrder(Lscope.v);
		outputToStackTable("qSort(array,"+Lscope.left+","+Lscope.right+")",qSortFrame.callStack.length-1);
		qSortFrame.nextFunction = QSort.checkIfLeftgtRight;
		updateCounter(1);
		drawPointers({position:Lscope.left,color:leftcolor},{position: Lscope.right,color:rightcolor});
},
checkIfLeftgtRight: function(qSortFrame)
{
		qSortFrame.nextLine(4);
		var Lscope = qSortFrame.scope;
		var outputStr = formatCondtionStr({type: "if",test: ">=",index1:Lscope.left,index2: Lscope.right,
			compare: function(a,b){ return a >= b}});
		outputToDivConsole(outputStr);
		if(Lscope.left >= Lscope.right){
			qSortFrame.nextFunction = QSort.insideIfReturn;
		}
		else{
			qSortFrame.nextFunction = QSort.swapLeftandMid;
		}
		updateCounter(1);
},
insideIfReturn: function(qSortFrame)
{
		qSortFrame.nextLine(5);
		QSort.genericReturn(qSortFrame);
		
},
swapLeftandMid: function(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	var mid = Math.floor((Lscope.left + Lscope.right)/2);
	
	qSortFrame.nextLine(6);
	qSortFrame.nextFunction = QSort.assignLast;
	callSwaps(Lscope.v,Lscope.left,mid);
	outputToDivConsole(formatStr(Lscope));
	drawPointers({position:Lscope.left,color:leftcolor},{position: Lscope.right,color:rightcolor},{position: mid,color:"#4e9a06"});
},
assignLast: function(qSortFrame)
{
	qSortFrame.nextLine(7);
	qSortFrame.scope.last = qSortFrame.scope.left;
	outputToDivConsole(formatStr(qSortFrame.scope));
	qSortFrame.nextFunction =QSort.initialForStatement;
	updateCounter(1);
	drawPointers({position:qSortFrame.scope.left,color:leftcolor},{position: qSortFrame.scope.right,color:rightcolor},{position:qSortFrame.scope.last,color:lastcolor});
},
initialForStatement: function(qSortFrame)
{
	//var qS = new QSort();
	qSortFrame.scope.i = qSortFrame.scope.left + 1;
	QSort.genericForCondition(qSortFrame);
	drawPointers({position:qSortFrame.scope.left,color:leftcolor},{position: qSortFrame.scope.right,color:rightcolor},{position:qSortFrame.scope.last,color:lastcolor},
		{position: qSortFrame.scope.i, color: itercolor});
	
},
genericForCondition: function(qSortFrame)
{
	qSortFrame.nextLine(8);
	outputToDivConsole(formatCondtionStr({type:"for loop",test: "<=",index1: qSortFrame.scope.i,
		index2: qSortFrame.scope.right,compare: function(a,b){return a <= b}}));
	if(qSortFrame.scope.i <= qSortFrame.scope.right){
		qSortFrame.nextFunction = QSort.iflessThanLeftCondition;
	}
	else{
		qSortFrame.nextFunction = QSort.swapLeftAndLast;
	}
	updateCounter(1);
},
iflessThanLeftCondition: function(qSortFrame)
{
	qSortFrame.nextLine(9);
	var Lscope = qSortFrame.scope;
	outputToDivConsole(formatCondtionStr({type:"if",test:"<",v:Lscope.v,index1: Lscope.i,index2:Lscope.left,
		compare: function(a,b){return a < b}}));
	
	if(Lscope.v[Lscope.i] < Lscope.v[Lscope.left]){
		qSortFrame.nextFunction = QSort.conditionalSwap;
	}
	else{
		qSortFrame.nextFunction = QSort.endSwapIfBlock;
	}
	updateCounter(1);
},
conditionalSwap:function(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	qSortFrame.nextLine(10);
	++Lscope.last;
	outputToDivConsole(formatStr(Lscope));
	drawPointers({position: Lscope.left,color:leftcolor},{position: Lscope.right,color:rightcolor},{position:Lscope.last,color:lastcolor},
		{position: Lscope.i, color: itercolor});
	callSwaps(Lscope.v,Lscope.last,Lscope.i);
	qSortFrame.nextFunction = QSort.endSwapIfBlock;
},
endSwapIfBlock: function(qSortFrame)
{
	qSortFrame.nextLine(11);
	qSortFrame.nextFunction = QSort.repeatForStatement;
},
repeatForStatement: function(qSortFrame)
{
	qSortFrame.nextLine(12);
	qSortFrame.scope.i++;
	drawPointers({position:qSortFrame.scope.left,color:leftcolor},{position: qSortFrame.scope.right,color:rightcolor},{position:qSortFrame.scope.last,color:lastcolor},
		{position: qSortFrame.scope.i, color: itercolor});
	QSort.genericForCondition(qSortFrame);
	updateCounter(1);
},
endForBlock:function(qSortFrame)
{
	qSortFrame.nextLine(12);
	qSortFrame.nextFunction = QSort.swapLeftAndLast;
},
swapLeftAndLast: function(qSortFrame)
{
	var Lscope = qSortFrame.scope;
	qSortFrame.nextLine(13);
	drawPointers({position:qSortFrame.scope.left,color:leftcolor},{position: qSortFrame.scope.right,color:rightcolor},{position:qSortFrame.scope.last,color:lastcolor},
		{position: qSortFrame.scope.i, color: itercolor});
	outputToDivConsole(formatStr(Lscope));
	callSwaps(Lscope.v,Lscope.left,Lscope.last);
	qSortFrame.nextFunction = QSort.recursiveCallQSort;
},
recursiveCallQSort: function(qSortFrame)
{	
	
	var oldV = qSortFrame.scope.v;
	var oldLast = qSortFrame.scope.last;
	var oldLeft = qSortFrame.scope.left;
	qSortFrame.nextLine(14);
	qSortFrame.callStack.push(qSortFrame.scope);
	qSortFrame.scope = {v:oldV,returnAddressFunction: QSort.returnAddressRecursiveCallQSort,left: oldLeft,right:oldLast-1};
	outputToDivConsole("Calling qSort recursively");
	qSortFrame.nextFunction = QSort.callQsort;
	
},
returnAddressRecursiveCallQSort: function(qSortFrame)
{
	qSortFrame.nextLine(14);
	qSortFrame.nextFunction = QSort.recursiveCallQSortAgain;
},
recursiveCallQSortAgain: function(qSortFrame)
{
	var oldV = qSortFrame.scope.v;
	var oldLast = qSortFrame.scope.last;
	var oldRight = qSortFrame.scope.right;
	qSortFrame.nextLine(15);
	qSortFrame.callStack.push(qSortFrame.scope);
	qSortFrame.scope = {v:oldV,returnAddressFunction: QSort.returnAddressAgain,left: oldLast+1,right:oldRight};
	outputToDivConsole("Calling qSort recursively");
	qSortFrame.nextFunction = QSort.callQsort;
	
},
returnAddressAgain: function(qSortFrame)
{
	qSortFrame.nextLine(16);
	QSort.genericReturn(qSortFrame)
},
genericReturn: function(qSortFrame)
{
	outputToDivConsole("Returning to calling function - stack pointer:" + (qSortFrame.callStack.length -1));
	qSortFrame.nextFunction = qSortFrame.scope.returnAddressFunction;
	qSortFrame.popStack();
	markStackFrameForDeletion(qSortFrame.callStack.length);
	updateCounter(1);
},
terminalCall: function(qSortFrame)
{
	qSortFrame.scope = undefined;
	pageCleanUp();
}
}




