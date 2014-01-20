barmarginsize = 3;
barposition = 0;
maxallowedsize = 100;
maxallowedelements = 185;
spinnerinitialvalue = 0;
lineList =[];
codepointer = 0;

$(document).ready(function(){
	
	var toBeSorted =[];
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
		if(validateInputAsInterger(n = $("#numberbox").val())){
			console.log("valid: n =" + n);
			toBeSorted = generateRandomizedList(n,maxallowedsize);
			initialDrawGraph(toBeSorted);	
		}
		else{
			console.log("invalid");
			$("#elemInput").val("")
		}
	});
	
	$("#start").click(function(e){
		LoadCode([30,50,75,90]);
	});
	
	$("#nextStep").click(function(e){
		execNextLine();
	});
	
	$("#prevStep").click(function(e){
		var x = [30,50,75,90];
		swapBars(x,0,3);		
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
	$("#line"+lineNext).addClass("selectedLine");
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

