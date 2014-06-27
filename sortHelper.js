function sortController(maxSize)
{
	//#<function_globals
	var maxallowedsize = maxSize || 100;
	var context = {}
	var barmarginsize = 1;
	var barwidth = 0;
	var xBarHeight = 5;
	var graphboxSideMargins = 10;
	var hasStarted = false;
	var opcounter = 0;
	var swapCounter = 0;
	var intervalKey = undefined;
	var algorithm = {};
	var stateEnum = {NOTSTARTED:1,LOADED:2, STARTED:4,AUTO:8,PAUSED: 16,FINISHED: 32}
	var state = stateEnum.NOTSTARTED;
	var toBeSorted =[];
	var myframe = {};
	//#function_globals>

	//#<
		context.execInitial = function(toBeSorted)
		{
			var currentframe = {};
				if((state &(stateEnum.NOTSTARTED|stateEnum.LOADED)))
				{
					$(".selectedLine").removeClass("selectedLine");
					$("#order").find("tbody").empty();
					$("#stack").find("tbody").empty();
					$("#console").empty();
					initialDrawGraph(toBeSorted);
					this.updateCounter(opcounter = 0,swapCounter = 0);
				}
				currentframe = algorithm.LoadCode(toBeSorted.slice());
				myframe = currentframe;
				this.execNextLine();
				hasStarted = true;
			
		};
		
		context.execNextLine = function()
		{
			$(".switchedelem").removeClass("switchedelem").addClass("unselectedelem");
			myframe.nextFunction(myframe);
		};
		context.autoSort = function(time)
		{
			$("#autostepfast").attr("disabled","disabled");
			$("#autostepslow").attr("disabled","disabled");
			$("#autostepnormal").attr("disabled","disabled");
			$("#start").attr("disabled","disabled");
			$("#pause").removeAttr("disabled");
			if(state &(stateEnum.LOADED|stateEnum.NOTSTARTED))
			{
				this.execInitial(toBeSorted);
			}
			state = stateEnum.AUTO;
			intervalKey = setInterval(
				this.execNextLine,time);
		};
		context.funcLoader = function(funcName)
		{
			$.getScript(funcName+".js",function(data, textStatus, jqxhr) {
				console.log(data); //data returned
				console.log(textStatus); //success
				console.log(jqxhr.status); //200
				console.log('Load was performed.');
				});
			//return 
		};
		context.getValueAction = function()
		{
			var n;
				myframe = {};
				if(intervalKey){
					clearInterval(intervalKey);
				}
				state = stateEnum.LOADED;
			
				if(validateInputAsInterger(n = $("#numberbox").val())){
					barwidth = Math.round((($("#graphbox").width()) -graphboxSideMargins -(barmarginsize*n))/n);
					toBeSorted = generateRandomizedList(n,maxallowedsize);
					//toBeSorted = [30,75,20,50,90]
					initialDrawGraph(toBeSorted);	
					$("#start").removeAttr("disabled");
					$("#autostepfast").removeAttr("disabled");
					$("#autostepslow").removeAttr("disabled");
					$("#autostepnormal").removeAttr("disabled");
					$("#nextStep").attr("disabled","disabled");
					$("#prevStep").attr("disabled","disabled");
				}
				else{
					console.log("invalid");
					$("#elemInput").val("")
				}
		};
		context.stepAction = function()
		{
			if(state & (stateEnum.LOADED|stateEnum.NOTSTARTED)){
				this.execInitial(toBeSorted);
			}
			else{
				this.execNextLine();
			}
			state = stateEnum.STARTED;
		};
		context.pauseAction = function()
		{
				if(intervalKey){
					clearInterval(intervalKey);
				}
				state = stateEnum.PAUSED;
				$("#pause").attr("disabled","disabled");
				$("#start").removeAttr("disabled");
				$("#autostepfast").removeAttr("disabled");
				$("#autostepslow").removeAttr("disabled");
				$("#autostepnormal").removeAttr("disabled");
		};
	//#>


	//#<pointers 
	function killAllPointers()
	{
		$(".pointerbar").remove();
	}		
	
	function drawVerticals(gPointerObjs)
	{
		//stores the number of elements that are displayed to a single location
		var overlapchecker = {}; 
		for(var i = 0;i < gPointerObjs.length;i++){
			//checks if two blocks are displayed to the same location. If so, then it one of them is halved.
			//if something exists at that location, increment it otherwise initialize it to 1
			overlapchecker[gPointerObjs[i].position.toString()]++ || (overlapchecker[gPointerObjs[i].position.toString()] = 1);
			$("#pointerbox").append("<div class=\"bar pointerbar\" id=\"elem" + i + "\"></div>");
			$("#pointerbox").find("#elem"+i).css("margin-left", getBarMarginSize(gPointerObjs[i].position)+"px")
				.css("height",(100/overlapchecker[gPointerObjs[i].position.toString()]) +"%")
				.css("width",barwidth+"px")
				.css("background-color",gPointerObjs[i].color);

		}
	}
	
	//draw the bars that reach from the horizontal lines to the vertical.
	function drawReachers(gPointerObjs){
		for(var i = 0;i<gPointerObjs.length;i++){
			
			$("#pointer_x_box").append("<div class=\"pointerbar reachers\" id=\"reachElem" +i +"\"></div>");
			$("#pointer_x_box").find("#reachElem" +i)
				.css("margin-left", getBarMarginSize(gPointerObjs[i].position) +"px")
				.css("height",(xBarHeight*i) +"px")
				.css("width",barwidth+"px")
				.css("background-color",gPointerObjs[i].color);
		}
	}
	
	function drawHorizontals(gPointerObjs)
	{

		for(var i = 0; i < gPointerObjs.length;i++){

			
			$("#pointer_x_box").append("<div class=\"pointerbar \" id=\"xElem" +i +"\"></div>");
			$("#pointer_x_box").find("#xElem" +i)
				.css("margin-left", getBarMarginSize(gPointerObjs[i].position) +"px")
				.css("height",xBarHeight +"px")
				.css("background-color",gPointerObjs[i].color);
				
		}
	}
	
	function getBarMarginSize(position)
	{
		return ((barmarginsize+barwidth)*position); 
	}

	context.drawPointers = function()
	{
		killAllPointers();
		
		var barhtml = "";
		var sorted = Array.slice(arguments);
		sorted.sort(function(a,b){return (b.position - a.position)});
		drawVerticals(sorted);
		drawHorizontals(sorted);
		drawReachers(sorted);
		
	};
	//#pointers>

	//#<graph_draw
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
	//#graph_draw>

	//#<utilities
	function getRandomInt(min,max){
		return Math.floor(Math.random() * (max -min + 1) + min);
	}

	function generateRandomizedList(numofelements,maxpotential){
		var toBeSorted = [];
		for(i = 0;i< numofelements;i++){
			toBeSorted[i] = getRandomInt(1,maxpotential);
		}
		return toBeSorted;
	}

	function validateInputAsInterger(input){
		var numRegex = /^\d+$/;
		return numRegex.test(input);
	}
	
	function StrRepeat(str,num)
	{
		return new Array(num + 1).join(str);
	}
	
	function StrPadLeft(minlen, str,padStr)
	{
	
		if(typeof str != "string"){
			str = str.toString();
		}
		
		if(typeof padStr != "string"){
			padStr = padStr.toString();
		}
		
        var size = (padStr.length * (minlen - str.length)) + str.length; 
		return String(StrRepeat(padStr,minlen) + str).slice(-size);
	}
	
	//#utilities>

	//#<swap_operations
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

	context.callSwaps = function(toBeSorted,index1,index2)
	{	
		swapBars(toBeSorted,index1,index2);
		this.outputToDivConsole(formatSwapStr(toBeSorted,index1,index2));
		this.outputCurrentSortOrder(toBeSorted,index1,index2);
		this.updateCounter(5,1);
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
	//#swap_operations>

	//#<format_string_operations
	function formatSwapStr(v,index1,index2)
	{
		return "swaping v[" +index1+"]: "+v[index1]+" and v["+index2+"]: "+ v[index2];
	}

	function makeBarsNormal(index1,index2)
	{
		swapClasses("#elem"+index1,"switchedelem","unselectedelem");
		swapClasses("#elem"+index2,"switchedelem","unselectedelem");
	}

	context.formatCondtionStr = function(cond)
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
	//#format_string_operations>

	//#<outputs_to_displays
	context.outputToDivConsole = function(outputStr,lineNum)
	{
		$("#console").append("<p>"+(lineNum>0?(lineNum +": "):"")+outputStr+"</p>");
		autoScroll(console);
	};

	context.outputCurrentSortOrder = function(needsSorting,index1,index2)
	{
		var toBeSorted = needsSorting.slice();
		if(index1 && index2){
			toBeSorted[index1] = "<span class=\"swapedArrayElem\" >"+ toBeSorted[index1] + "</span>";
			toBeSorted[index2] = "<span class=\"swapedArrayElem\" >"+ toBeSorted[index2] + "</span>";
		}
		$("#order").find("tbody:last").append("<tr><td>["+ toBeSorted.toString()+"]</td></tr>");
		autoScroll(order);
	};

	context.outputToStackTable = function(funcName){
		var disabledRows = $("#stack").find("tbody:last").find("tr").filter(".disabledStackFrame");
		if(disabledRows.length){
			var firstDisabled = disabledRows.first();
			firstDisabled.removeClass("disabledStackFrame");
			firstDisabled.html("<td>"+funcName+"</td>");
		}
		else{
			$("#stack").find("tbody:last").append("<tr><td>"+funcName+"</td></tr>");
			autoScroll(stack);
		}
	};
	//outputs_to_displays#>

	context.updateCounter = function(increments,swapIncrements)
	{
		opcounter += increments;
		$("#opcounter").html("n: "+ opcounter);
		if(swapIncrements)
		{
			swapCounter += swapIncrements;
			$("#swapcounter").html("swaps: "+ swapCounter);
		}
	};

	context.nextLine = function(lineNext){
	
		this.lineCurrent = this.lineCurrent === 0? 0: this.lineCurrent || -1;
		if(this.lineCurrent != -1)
		{
			$("#line"+this.lineCurrent).removeClass("selectedLine");
		}
		if(lineNext != -1)
		{
			$("#line"+lineNext).addClass("selectedLine");
		}
		this.lineCurrent = lineNext;
	};


	context.markStackFrameForDeletion = function(i)
	{
		$("#stack").find("tbody:last").find("tr").not(".disabledStackFrame").last().addClass("disabledStackFrame");
	}

	function autoScroll(scrolldiv,interval)
	{
		if(scrolldiv.scrollTop < scrolldiv.scrollHeight - scrolldiv.clientHeight){
			scrolldiv.scrollTop += (interval || 17);
		}
	}

	function setUpCodeSpace(source)
	{
		$("#codewindow").empty();
		for(i = 0; i < source.length;i++){
			var line = "<div id=\"line"+i+"\" class=\"insideCodeWindow\"><span>"+StrPadLeft(source.length.toString().length,(i+1).toString(),"&nbsp;")+": </span>"+
			" <span style=\"margin-left:"+ source[i][1]+"\"  >"+source[i][0]+"</span></div>";
			$("#codewindow").append(line);
		}
	}

	context.pageCleanUp =function()
	{
		if(intervalKey){
			clearInterval(intervalKey);
		}
		killAllPointers();
		state = stateEnum.FINISHED;
		$("#start").attr("disabled","disabled");
		$("#autostepslow").attr("disabled","disabled");
		$("#autostepnormal").attr("disabled","disabled");
		$("#pause").attr("disabled","disabled");
		alert("array is done sorting");
	}

	algorithm =  QSort(context);
	setUpCodeSpace(algorithm.sourceCode);
	return context;
	
}

