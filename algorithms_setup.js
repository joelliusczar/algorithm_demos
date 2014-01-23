barmarginsize = 3;
barposition = 0;
maxallowedsize = 100;
maxallowedelements = 185;
spinnerinitialvalue = 0;



function Frame(myscope)
{
	this.scope = this.scope || myscope || {};
	this.prevline = this.prevline || -1;
	this.nextLine = this.nextLine || 0;
	this.callStack = this.callStack || [];
	this.negCallStack = this.negCallStack || [];
	this.codepointer = this.codepointer || 0;
	this.nextFunction = this.nextFunction || {};
	
	this.prepareNextLineSelection = function(nl){
		this.prevline = this.nextLine;
		this.nextLine = nl||this.nextLine+1;
	};
	
	this.popStack = function(){
		this.negCallStack.push(this.scope);
		this.scope = this.callStack.pop();
		
	};
}

$(document).ready(function(){
	
	var toBeSorted =[];
	var myframe = {};
	$("#nextStep").attr("disabled","disabled");
	$("#prevStep").attr("disabled","disabled");
	$("#start").attr("disabled","disabled");
	
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
		lineList = [];
		if(validateInputAsInterger(n = $("#numberbox").val())){
			console.log("valid: n =" + n);
			//toBeSorted = generateRandomizedList(n,maxallowedsize);
			initialDrawGraph(toBeSorted = [30,75,20,50,90]);	
		}
		else{
			console.log("invalid");
			$("#elemInput").val("")
		}
	});
	
	$("#start").click(function(e){
		$("#nextStep").removeAttr("disabled");
		$("#prevStep").removeAttr("disabled");
		$("#start").val("Restart");
		myframe = LoadCode(toBeSorted);
		
	});
	
	$("#nextStep").click(function(e){
		execNextLine(myframe);
	});
	
	$("#prevStep").click(function(e){
	});


});

function initialDrawGraph(toBeSorted)
{
	var barhtml = "";
	var margin = 0;
	emptyGraph();
	for(i=0;i<toBeSorted.length;i++){
		barhtml = "<div class=\"bar unselectedelem\" id=\"elem" + i + "\" style=\"margin-left:" + 
			(barposition = ((barmarginsize)+barposition)) + "px; height:"+ toBeSorted[i] +"%;\"></div>";
		$(barhtml).appendTo("#graphbox");
	}
}

function emptyGraph()
{
	$("#graphbox").empty();
	barposition = 0;
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

function makeBarsNormal(index1,index2)
{
	swapClasses("#elem"+index1,"switchedelem","unselectedelem");
	swapClasses("#elem"+index2,"switchedelem","unselectedelem");
}

function outputToDivConsole(outputStr)
{
	$("#console").append("<p>"+outputStr+"</p>");
}

function outputCurrentSortOrder(toBeSorted)
{
	$("#order").find("tbody:last").append("<tr><td>["+ toBeSorted.toString()+"]</td></tr>");
}

function outputToStackTable(funcName,rn){
	if($("#row"+rn).length)
	{
		$("#row"+rn).remove();
	}
	$("#stack").find("tbody:last").append("<tr id=\"row"+rn+" \"><td>"+funcName+"</td></tr>");
}

function markStackFrameForDeletion(index)
{
	$("#row"+index).addClass("disabledStackFrame");
}

function setUpCodeSpace()
{
	for(i = 0; i < source.length;i++){
		var line = "<div id=\"line"+i+"\" class=\"insideCodeWindow\" style=\"margin-left:"+ source[i][1]+"\"  >"+source[i][0]+"</div>";
		$("#codewindow").append(line);
	}
}

