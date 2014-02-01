barmarginsize = 3;
maxallowedsize = 100;
maxallowedelements = 185;
spinnerinitialvalue = 0;
hasStarted = false;
opcounter = 0;
swapCounter = 0;
intervalKey = undefined;
consoleDiv = undefined;
stackDiv = undefined;
orderDiv = undefined;
barwidth = 0;


function Frame(pScope)
{
	this.scope = pScope|| {};
	this.prevline = -1;
	this.callStack = [];
	this.negCallStack = [];
	this.nextFunction = {};
	
	this.popStack = function(){
		
		//this.negCallStack.push($.extend({},this.scope));
		if(this.callStack.length == 0){
			this.scope = {};
		}
		else{
			this.scope = this.callStack.pop();
		}
		
	};
	
	this.nextLine = function(nl){
		nextLine(this.prevline,nl);
		this.prevline = nl;
	};
	
}

$(document).ready(function(){
	
	var toBeSorted =[];
	var myframe = {};
	$("#nextStep").attr("disabled","disabled");
	$("#prevStep").attr("disabled","disabled");
	$("#start").attr("disabled","disabled");
	consoleDiv = document.getElementById("console");
	stackDiv = document.getElementById("stack");
	orderDiv = document.getElementById("order");
	
	setUpCodeSpace();
	
	var spinner = $("#numberbox").spinner({min: -1,max:maxallowedelements +1, step:1,spin: function(e,ui){
	if(ui.value > maxallowedelements){
		$(this).spinner("value",spinnerinitialvalue);
		return false;
	}
	else if(ui.value < spinnerinitialvalue){
		$(this).spinner("value",maxallowedelements);
		return false;
	}
	}});
	
	$("#getvalue").click(function(e){
		var n;
		$("#start").removeAttr("disabled");
		$("#nextStep").attr("disabled","disabled");
		$("#prevStep").attr("disabled","disabled");
		myframe = {};
		if(validateInputAsInterger(n = $("#numberbox").val())){
			barwidth = $("#graphbox").width()/n;
			toBeSorted = generateRandomizedList(n,maxallowedsize);
			//toBeSorted = [30,75,20,50,90]
			initialDrawGraph(toBeSorted);	
			barwidth = $("#graphbox").width()/n;
		}
		else{
			console.log("invalid");
			$("#elemInput").val("")
		}
	});
	
	$("#start").click(function(e){
		myframe = execInitial(toBeSorted);
	});
	
	$("#nextStep").click(function(e){
		execNextLine(myframe);
	});
	
	$("#autostepfive").click(function(e){
		autoSort(5000,toBeSorted);
	});
	
	$("#autostepone").click(function(e){
		autoSort(250,toBeSorted);
	});


});

function execInitial(toBeSorted)
{
	var currentframe = {};
	$("#nextStep").removeAttr("disabled");
		$("#prevStep").removeAttr("disabled");
		$("#start").html("Restart");
		if(hasStarted)
		{
			$(".selectedLine").removeClass("selectedLine");
			$("#order").find("tbody").empty();
			$("#stack").find("tbody").empty();
			$("#console").empty();
			initialDrawGraph(toBeSorted);
			updateCounter(opcounter = 0,swapCounter = 0);
		}
		currentframe = LoadCode(toBeSorted.slice());
		hasStarted = true;
		
		return currentframe;
}

function execNextLine(currentFrame)
{
	$(".switchedelem").removeClass("switchedelem").addClass("unselectedelem");
	currentFrame.nextFunction(currentFrame);
}

function autoSort(time,toBeSorted)
{
	var currentFrame = {};
	currentFrame = execInitial(toBeSorted);
	intervalKey = setInterval(function(){
		execNextLine(currentFrame);
	},time);
}

function initialDrawGraph(toBeSorted)
{
	var barhtml = "";
	var margin = 0;
	emptyGraph();
	for(i=0;i<toBeSorted.length;i++){
		barhtml = "<div class=\"bar unselectedelem\" id=\"elem" + i + "\" style=\"margin-left:" + 
			((barmarginsize+barwidth)*i) + "px; height:"+ toBeSorted[i] +"%; width:"+barwidth+"px; \"></div>";
		$(barhtml).appendTo("#graphbox");
	}
}


function emptyGraph()
{
	$("#graphbox").empty();
}

function getRandomInt(min,max){
	return Math.floor(Math.random() * (max -min + 1) + min);
}

function generateRandomizedList(numofelements,maxpotential){
	var toBeSorted = [];
	for(i = 0;i< numofelements;i++){
		toBeSorted[i] = getRandomInt(0,maxpotential);
	}
	return toBeSorted;
}

function validateInputAsInterger(input){
	var numRegex = /^\d+$/;
	return numRegex.test(input);
}

function updateCounter(increments,swapIncrements)
{
	opcounter += increments;
	$("#opcounter").html("n: "+ opcounter);
	if(swapIncrements)
	{
		swapCounter += swapIncrements;
		$("#swapcounter").html("swaps: "+ swapCounter);
	}
}

function nextLine(lineCurrent,lineNext){
	if(lineCurrent != -1)
	{
		$("#line"+lineCurrent).removeClass("selectedLine");
	}
	if(lineNext != -1)
	{
		$("#line"+lineNext).addClass("selectedLine");
	}
}

function drawPointers()
{
	killAllPointers();
	var overlapchecker = {};
	var barhtml = "";
	for(var i = 0;i < arguments.length;i++){
		overlapchecker[arguments[i].position.toString()]++ || (overlapchecker[arguments[i].position.toString()] = 1)
		barhtml = "<div class=\"bar pointerbar\" id=\"elem" + i + "\" style=\"margin-left:" + 
			((barmarginsize+barwidth)*arguments[i].position) + "px; height: "+(100/overlapchecker[arguments[i].position.toString()])+"%; background-color:"+arguments[i].color+
				"; width:"+barwidth+"px; \"></div>";
			$(barhtml).appendTo("#pointerbox");
	}
}


function killAllPointers()
{
	$(".pointerbar").remove();
}

function markReadyForSwap(index1,index2)
{	
	swapClasses("#elem" + index1,"unselectedelem","selectedelem");
	swapClasses("#elem" + index2,"unselectedelem","selectedelem");
}

function swapClasses(element,currentclass,newclass)
{
	$(element).removeClass(currentclass);
	$(element).addClass(newclass);
}

function callSwaps(toBeSorted,index1,index2)
{	
	swapBars(toBeSorted,index1,index2);
	outputToDivConsole(formatSwapStr(toBeSorted,index1,index2));
	outputCurrentSortOrder(toBeSorted,index1,index2);
	updateCounter(5,1);
	return swap(toBeSorted,index1,index2);
}

function swap(toBeSorted,index1,index2)
{
	var temp = toBeSorted[index1];
	toBeSorted[index1] = toBeSorted[index2];
	toBeSorted[index2] = temp;
	
	return toBeSorted;
}

function swapBars(toBeSorted,index1,index2)
{
	var height1 = toBeSorted[index1];
	var height2 = toBeSorted[index2];
	var heightpercentregex = /\d+%/;
	
	var style = $("#elem"+index1).attr("style");
	$("#elem"+index1).attr("style",style.replace(heightpercentregex,height2+"%"));
	swapClasses("#elem" + index1,"unselectedelem","switchedelem");
	
	style = $("#elem"+index2).attr("style");
	$("#elem"+index2).attr("style",style.replace(heightpercentregex,height1+"%"));
	swapClasses("#elem" + index2,"unselectedelem","switchedelem");
}



function formatSwapStr(v,index1,index2)
{
	return "swaping v[" +index1+"]: "+v[index1]+" and v["+index2+"]: "+ v[index2];
}

function makeBarsNormal(index1,index2)
{
	swapClasses("#elem"+index1,"switchedelem","unselectedelem");
	swapClasses("#elem"+index2,"switchedelem","unselectedelem");
}

function formatCondtionStr(cond)
{
	var op1;
	var op2;
	var idxCmp = "";
	if(cond.v){
		idxCmp = "v["+cond.index1+"] "+cond.test+" v["+cond.index2+"] ";
		op1 = cond.v[cond.index1];
		op2 = cond.v[cond.index2];
	}
	else{
		op1 = cond.index1;
		op2 = cond.index2;
	}
	
	var outputStr = cond.type + " - "+idxCmp + op1 +" "+ cond.test+" " +op2 +" ? " + cond.compare(op1,op2);
	
	
	return outputStr;
	
}

function outputToDivConsole(outputStr)
{
	$("#console").append("<p>"+outputStr+"</p>");
	autoScroll(consoleDiv);
}

function outputCurrentSortOrder(needsSorting,index1,index2)
{
	var toBeSorted = needsSorting.slice();
	if(index1 && index2){
		toBeSorted[index1] = "<span class=\"swapedArrayElem\" >"+ toBeSorted[index1] + "</span>";
		toBeSorted[index2] = "<span class=\"swapedArrayElem\" >"+ toBeSorted[index2] + "</span>";
	}
	$("#order").find("tbody:last").append("<tr><td>["+ toBeSorted.toString()+"]</td></tr>");
	autoScroll(orderDiv,16);
}

function outputToStackTable(funcName){
	var disabledRows = $("#stack").find("tbody:last").find("tr").filter(".disabledStackFrame");
	if(disabledRows.length){
		var firstDisabled = disabledRows.first();
		firstDisabled.removeClass("disabledStackFrame");
		firstDisabled.html("<td>"+funcName+"</td>");
	}
	else{
		$("#stack").find("tbody:last").append("<tr><td>"+funcName+"</td></tr>");
		autoScroll(stackDiv);
	}
}

function markStackFrameForDeletion(i)
{
	$("#stack").find("tbody:last").find("tr").not(".disabledStackFrame").last().addClass("disabledStackFrame");
}

function autoScroll(scrolldiv,interval)
{
	if(scrolldiv.scrollTop < scrolldiv.scrollHeight - scrolldiv.clientHeight){
		scrolldiv.scrollTop += (interval || 13);
	}
}

function setUpCodeSpace()
{
	for(i = 0; i < source.length;i++){
		var line = "<div id=\"line"+i+"\" class=\"insideCodeWindow\" style=\"margin-left:"+ source[i][1]+"\"  >"+source[i][0]+"</div>";
		$("#codewindow").append(line);
	}
}

function pageCleanUp()
{
	if(intervalKey){
		clearInterval(intervalKey);
	}
	killAllPointers();
	alert("array is done sorting");
}

